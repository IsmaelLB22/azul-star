"use client"

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Copy, FileDown, Search } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import PCConfigForm from './pc-config-form'

// Types
type Component = {
    name: string
    price: number
    notes?: string
}

type PCConfig = {
    id: string
    name: string
    motherboard: Component
    case: Component
    powerSupply: Component
    ram: Component
    cpu: Component
    ssd: Component
    hdd: Component
    graphicsCard: Component
    saleTarget: number
}

export default function PCConfigManager() {
    const [configs, setConfigs] = useState<PCConfig[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [editingConfig, setEditingConfig] = useState<PCConfig | null>(null)
    const [isFormOpen, setIsFormOpen] = useState(false)

    useEffect(() => {
        const storedConfigs = localStorage.getItem('pcConfigs')
        if (storedConfigs) {
            setConfigs(JSON.parse(storedConfigs))
        }
    }, [])

    useEffect(() => {
        localStorage.setItem('pcConfigs', JSON.stringify(configs))
    }, [configs])

    const calculateTotalPrice = (config: PCConfig) => {
        return Object.values(config).reduce((total, component) => {
            if (typeof component === 'object' && 'price' in component) {
                return total + component.price
            }
            return total
        }, 0)
    }

    const filteredConfigs = configs.filter(config =>
        config.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        Object.values(config).some(component =>
            typeof component === 'object' && 'name' in component &&
            component.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
    )

    const handleSave = (config: PCConfig) => {
        if (editingConfig) {
            setConfigs(configs.map(c => c.id === config.id ? config : c))
        } else {
            setConfigs([...configs, config])
        }
        setIsFormOpen(false)
        setEditingConfig(null)
    }

    const handleEdit = (config: PCConfig) => {
        setEditingConfig(config)
        setIsFormOpen(true)
    }

    const handleDelete = (id: string) => {
        setConfigs(configs.filter(c => c.id !== id))
    }

    const handleDuplicate = (config: PCConfig) => {
        const newConfig = {
            ...config,
            id: Date.now().toString(),
            name: `${config.name} (copie)`
        }
        setConfigs([...configs, newConfig])
    }

    const handleExport = (config: PCConfig) => {
        const configString = JSON.stringify(config, null, 2)
        const blob = new Blob([configString], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${config.name}.json`
        a.click()
        URL.revokeObjectURL(url)
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Gestionnaire de Configurations PC</h1>
            <div className="flex justify-between mb-4">
                <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => setEditingConfig(null)}>
                            <Plus className="mr-2 h-4 w-4" /> Nouvelle Configuration
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>{editingConfig ? 'Modifier' : 'Ajouter'} une configuration</DialogTitle>
                        </DialogHeader>
                        <PCConfigForm
                            config={editingConfig}
                            onSave={handleSave}
                            onCancel={() => setIsFormOpen(false)}
                        />
                    </DialogContent>
                </Dialog>
                <div className="flex items-center">
                    <Input
                        type="text"
                        placeholder="Rechercher..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="mr-2"
                    />
                    <Button variant="outline"><Search className="h-4 w-4" /></Button>
                </div>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nom</TableHead>
                        <TableHead>Prix Total</TableHead>
                        <TableHead>Objectif de Vente</TableHead>
                        <TableHead>Marge</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredConfigs.map(config => {
                        const totalPrice = calculateTotalPrice(config)
                        const margin = config.saleTarget - totalPrice
                        return (
                            <TableRow key={config.id}>
                                <TableCell>{config.name}</TableCell>
                                <TableCell>{totalPrice.toFixed(2)} €</TableCell>
                                <TableCell>{config.saleTarget.toFixed(2)} €</TableCell>
                                <TableCell className={margin >= 0 ? 'text-green-600' : 'text-red-600'}>
                                    {margin.toFixed(2)} €
                                </TableCell>
                                <TableCell>
                                    <Button variant="ghost" size="icon" onClick={() => handleEdit(config)}><Edit className="h-4 w-4" /></Button>
                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(config.id)}><Trash2 className="h-4 w-4" /></Button>
                                    <Button variant="ghost" size="icon" onClick={() => handleDuplicate(config)}><Copy className="h-4 w-4" /></Button>
                                    <Button variant="ghost" size="icon" onClick={() => handleExport(config)}><FileDown className="h-4 w-4" /></Button>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
            <Card className="mt-8">
                <CardHeader>
                    <CardTitle>Statistiques Globales</CardTitle>
                    <CardDescription>Aperçu des données sur toutes les configurations</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Nombre total de configurations : {configs.length}</p>
                    <p>Prix moyen des configurations : {
                        (configs.reduce((sum, config) => sum + calculateTotalPrice(config), 0) / configs.length || 0).toFixed(2)
                    } €</p>
                    <p>Configuration la plus coûteuse : {
                        configs.reduce((max, config) => Math.max(max, calculateTotalPrice(config)), 0).toFixed(2)
                    } €</p>
                    <p>Configuration la plus abordable : {
                        configs.length > 0 ?
                            configs.reduce((min, config) => Math.min(min, calculateTotalPrice(config)), Infinity).toFixed(2) :
                            '0.00'
                    } €</p>
                </CardContent>
            </Card>
        </div>
    )
}