"use client"

import { useState, useEffect } from 'react'
import {Plus, Edit, Trash2, Copy, FileDown, Search, ChevronDown, TreePalm} from 'lucide-react'
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
            className="min-h-screen bg-gradient-to-br from-orange-400 to-yellow-200 p-8"
        >
            <motion.h1
                initial={{ y: -50 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="text-5xl font-bold mb-8 text-center text-orange-900 flex items-center justify-center"
            >
                <TreePalm className="mr-4 h-12 w-12 text-yellow-500" />
                Gestionnaire de Configurations PC Exotiques
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
                            className="bg-yellow-500 hover:bg-yellow-600 text-orange-900 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg"
                        >
                            <Plus className="mr-2 h-4 w-4" /> Nouvelle Configuration
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px] bg-gradient-to-br from-orange-300 to-yellow-200">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold text-orange-900">{editingConfig ? 'Modifier' : 'Ajouter'} une configuration</DialogTitle>
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
                        className="mr-2 bg-orange-100 text-orange-900 placeholder-orange-400 border-orange-300 focus:border-yellow-500 focus:ring-yellow-500 transition-all duration-300"
                    />
                    <Button variant="outline" className="bg-yellow-400 hover:bg-yellow-500 text-orange-900 border-orange-400 transition-all duration-300">
                        <Search className="h-4 w-4" />
                    </Button>
                </div>
            </motion.div>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <Card className="overflow-hidden shadow-2xl bg-orange-100">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-orange-300">
                                <TableHead className="text-orange-900 font-bold">Nom</TableHead>
                                <TableHead className="text-orange-900 font-bold">Prix Total</TableHead>
                                <TableHead className="text-orange-900 font-bold">Objectif de Vente</TableHead>
                                <TableHead className="text-orange-900 font-bold">Marge</TableHead>
                                <TableHead className="text-orange-900 font-bold">Actions</TableHead>
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
                                            className="bg-orange-50 hover:bg-yellow-100 transition-colors duration-300"
                                        >
                                            <TableCell className="font-medium text-orange-900">{config.name}</TableCell>
                                            <TableCell className="text-orange-800">{totalPrice.toFixed(2)} €</TableCell>
                                            <TableCell className="text-orange-800">{config.saleTarget.toFixed(2)} €</TableCell>
                                            <TableCell className={margin >= 0 ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                                                {margin.toFixed(2)} €
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex space-x-2">
                                                    <Button variant="ghost" size="icon" onClick={() => handleEdit(config)} className="hover:bg-yellow-200 text-orange-700 transition-colors duration-300">
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(config.id)} className="hover:bg-red-200 text-red-700 transition-colors duration-300">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" onClick={() => handleDuplicate(config)} className="hover:bg-green-200 text-green-700 transition-colors duration-300">
                                                        <Copy className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" onClick={() => handleExport(config)} className="hover:bg-blue-200 text-blue-700 transition-colors duration-300">
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
                        <Button variant="outline" className="w-full flex justify-between items-center bg-yellow-400 hover:bg-yellow-500 text-orange-900 border-orange-400 transition-all duration-300">
                            <span>Statistiques Globales</span>
                            <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isStatsOpen ? 'transform rotate-180' : ''}`} />
                        </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <Card className="mt-4 bg-gradient-to-br from-orange-200 to-yellow-100 shadow-xl">
                            <CardHeader>
                                <CardTitle className="text-2xl text-orange-900">Aperçu des données</CardTitle>
                                <CardDescription className="text-orange-700">Statistiques sur toutes les configurations</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2, duration: 0.5 }}
                                    className="space-y-4 text-orange-800"
                                >
                                    <p className="text-lg"><span className="font-bold">Nombre total de configurations :</span> {configs.length}</p>
                                    <p className="text-lg"><span className="font-bold">Prix moyen des configurations :</span> {
                                        (configs.reduce((sum, config) => sum + calculateTotalPrice(config), 0) / configs.length || 0).toFixed(2)
                                    } €</p>
                                    <p className="text-lg"><span className="font-bold">Configuration la plus coûteuse :</span> {
                                        configs.reduce((max, config) => Math.max(max, calculateTotalPrice(config)), 0).toFixed(2)
                                    } €</p>
                                    <p className="text-lg"><span className="font-bold">Configuration la plus abordable :</span> {
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