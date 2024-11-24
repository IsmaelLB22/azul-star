"use client"

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Copy, FileDown, Search, ChevronDown, Cpu, AlertTriangle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
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

    const isConfigComplete = (config: PCConfig) => {
        const requiredComponents = ['motherboard', 'case', 'powerSupply', 'ram', 'cpu', 'ssd', 'hdd', 'graphicsCard']
        return requiredComponents.every(component => config[component].name && config[component].price > 0) && config.saleTarget > 0
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
            className="min-h-screen bg-white p-4 sm:p-6 md:p-8 overflow-x-hidden"
        >
            <motion.h1
                initial={{ y: -50 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 md:mb-8 text-center text-blue-900 flex flex-col sm:flex-row items-center justify-center"
            >
                <Cpu className="mb-2 sm:mb-0 sm:mr-4 h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-blue-600" />
                <span>Gestionnaire de Configurations PC</span>
            </motion.h1>
            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center mb-4 sm:mb-6 space-y-4 sm:space-y-0 sm:space-x-4"
            >
                <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                    <DialogTrigger asChild>
                        <Button
                            onClick={() => setEditingConfig(null)}
                            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg"
                        >
                            <Plus className="mr-2 h-4 w-4" /> Nouvelle Configuration
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px] bg-white">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold text-blue-900">{editingConfig ? 'Modifier' : 'Ajouter'} une configuration</DialogTitle>
                        </DialogHeader>
                        <PCConfigForm
                            config={editingConfig}
                            onSave={handleSave}
                            onCancel={() => setIsFormOpen(false)}
                        />
                    </DialogContent>
                </Dialog>
                <div className="flex items-center w-full">
                    <Input
                        type="text"
                        placeholder="Rechercher..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="mr-2 flex-grow bg-white text-blue-900 placeholder-blue-400 border-blue-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300"
                    />
                    <Button variant="outline" className="bg-white hover:bg-blue-100 text-blue-600 border-blue-300 transition-all duration-300">
                        <Search className="h-4 w-4" />
                    </Button>
                </div>
            </motion.div>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <Card className="overflow-hidden shadow-lg bg-white">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-blue-50">
                                    <TableHead className="text-blue-900 font-bold">Nom</TableHead>
                                    <TableHead className="text-blue-900 font-bold">Prix Total</TableHead>
                                    <TableHead className="text-blue-900 font-bold">Objectif de Vente</TableHead>
                                    <TableHead className="text-blue-900 font-bold">Marge</TableHead>
                                    <TableHead className="text-blue-900 font-bold">Statut</TableHead>
                                    <TableHead className="text-blue-900 font-bold">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <AnimatePresence>
                                    {filteredConfigs.map(config => {
                                        const totalPrice = calculateTotalPrice(config)
                                        const margin = config.saleTarget - totalPrice
                                        const isComplete = isConfigComplete(config)
                                        return (
                                            <motion.tr
                                                key={config.id}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="border-b border-blue-100 hover:bg-blue-50 transition-colors duration-300"
                                            >
                                                <TableCell className="font-medium text-blue-900">{config.name}</TableCell>
                                                <TableCell className="text-blue-800">{totalPrice.toFixed(2)} €</TableCell>
                                                <TableCell className="text-blue-800">{config.saleTarget.toFixed(2)} €</TableCell>
                                                <TableCell className={margin >= 0 ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                                                    {margin.toFixed(2)} €
                                                </TableCell>
                                                <TableCell>
                                                    {isComplete ? (
                                                        <span className="text-green-600 font-bold">Complète</span>
                                                    ) : (
                                                        <TooltipProvider>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                  <span className="text-red-600 font-bold flex items-center cursor-help">
                                    <AlertTriangle className="w-4 h-4 mr-1" />
                                    Incomplète
                                  </span>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p>Cette configuration est incomplète. Veuillez remplir tous les champs requis.</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col sm:flex-row sm:flex-wrap justify-start space-y-2 sm:space-y-0 sm:space-x-2">
                                                        <Button variant="ghost" size="icon" onClick={() => handleEdit(config)} className="hover:bg-blue-100 text-blue-600 transition-colors duration-300">
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(config.id)} className="hover:bg-red-100 text-red-600 transition-colors duration-300">
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" onClick={() => handleDuplicate(config)} className="hover:bg-green-100 text-green-600 transition-colors duration-300">
                                                            <Copy className="h-4 w-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" onClick={() => handleExport(config)} className="hover:bg-yellow-100 text-yellow-600 transition-colors duration-300">
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
                    </div>
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
                        <Button variant="outline" className="w-full flex justify-between items-center bg-white hover:bg-blue-50 text-blue-600 border-blue-300 transition-all duration-300">
                            <span>Statistiques Globales</span>
                            <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isStatsOpen ? 'transform rotate-180' : ''}`} />
                        </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <Card className="mt-4 bg-white shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-2xl text-blue-900">Aperçu des données</CardTitle>
                                <CardDescription className="text-blue-600">Statistiques sur toutes les configurations</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2, duration: 0.5 }}
                                    className="space-y-4 text-blue-800"
                                >
                                    <p className="text-lg"><span className="font-bold">Nombre total de configurations :</span> {configs.length}</p>
                                    <p className="text-lg"><span className="font-bold">Configurations complètes :</span> {configs.filter(isConfigComplete).length}</p>
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