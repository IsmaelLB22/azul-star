"use client"

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Copy, FileDown, Search, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
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
    const [isStatsOpen, setIsStatsOpen] = useState(false)

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
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen"
        >
            <motion.h1
                initial={{ y: -50 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="text-4xl font-bold mb-8 text-center text-gray-800 dark:text-gray-100"
            >
                Gestionnaire de Configurations PC
            </motion.h1>
            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex justify-between mb-6"
            >
                <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                    <DialogTrigger asChild>
                        <Button
                            onClick={() => setEditingConfig(null)}
                            className="bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300 ease-in-out transform hover:scale-105"
                        >
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
                        className="mr-2 bg-white dark:bg-gray-700 transition-all duration-300 ease-in-out focus:ring-2 focus:ring-blue-500"
                    />
                    <Button variant="outline" className="bg-white dark:bg-gray-700 transition-all duration-300 ease-in-out hover:bg-gray-100 dark:hover:bg-gray-600">
                        <Search className="h-4 w-4" />
                    </Button>
                </div>
            </motion.div>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <Card className="overflow-hidden shadow-lg">
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
                            <AnimatePresence>
                                {filteredConfigs.map(config => {
                                    const totalPrice = calculateTotalPrice(config)
                                    const margin = config.saleTarget - totalPrice
                                    return (
                                        <motion.tr
                                            key={config.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <TableCell>{config.name}</TableCell>
                                            <TableCell>{totalPrice.toFixed(2)} €</TableCell>
                                            <TableCell>{config.saleTarget.toFixed(2)} €</TableCell>
                                            <TableCell className={margin >= 0 ? 'text-green-600' : 'text-red-600'}>
                                                {margin.toFixed(2)} €
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex space-x-2">
                                                    <Button variant="ghost" size="icon" onClick={() => handleEdit(config)} className="hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors duration-300">
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(config.id)} className="hover:bg-red-100 dark:hover:bg-red-900 transition-colors duration-300">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" onClick={() => handleDuplicate(config)} className="hover:bg-green-100 dark:hover:bg-green-900 transition-colors duration-300">
                                                        <Copy className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" onClick={() => handleExport(config)} className="hover:bg-yellow-100 dark:hover:bg-yellow-900 transition-colors duration-300">
                                                        <FileDown className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </motion.tr>
                                    )
                                })}
                            </AnimatePresence>
                        </TableBody>
                    </Table>
                </Card>
            </motion.div>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-8"
            >
                <Collapsible open={isStatsOpen} onOpenChange={setIsStatsOpen}>
                    <CollapsibleTrigger asChild>
                        <Button variant="outline" className="w-full flex justify-between items-center">
                            <span>Statistiques Globales</span>
                            <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isStatsOpen ? 'transform rotate-180' : ''}`} />
                        </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <Card className="mt-4">
                            <CardHeader>
                                <CardTitle>Aperçu des données</CardTitle>
                                <CardDescription>Statistiques sur toutes les configurations</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2, duration: 0.5 }}
                                    className="space-y-2"
                                >
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
                                </motion.div>
                            </CardContent>
                        </Card>
                    </CollapsibleContent>
                </Collapsible>
            </motion.div>
        </motion.div>
    )
}