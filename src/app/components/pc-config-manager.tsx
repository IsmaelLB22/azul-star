"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, Trash2, Edit, ChevronDown, ChevronUp, Search, SortAsc, SortDesc, DollarSign, Cpu, HardDrive } from 'lucide-react'
import PCConfigForm from './pc-config-form'

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

const STORAGE_KEY = 'pc-configs'

export default function PCConfigManager() {
    const [configs, setConfigs] = useState<PCConfig[]>([])
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingConfig, setEditingConfig] = useState<PCConfig | null>(null)
    const [expandedConfig, setExpandedConfig] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [sortBy, setSortBy] = useState<'name' | 'price'>('name')
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

    useEffect(() => {
        const savedConfigs = localStorage.getItem(STORAGE_KEY)
        if (savedConfigs) {
            try {
                setConfigs(JSON.parse(savedConfigs))
            } catch (e) {
                console.error('Error loading saved configurations:', e)
            }
        }
    }, [])

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(configs))
    }, [configs])

    const handleSave = (config: PCConfig) => {
        if (editingConfig) {
            setConfigs(configs.map(c => c.id === config.id ? config : c))
        } else {
            setConfigs([...configs, config])
        }
        setIsFormOpen(false)
        setEditingConfig(null)
    }

    const handleDelete = (id: string) => {
        setConfigs(configs.filter(c => c.id !== id))
    }

    const handleEdit = (config: PCConfig) => {
        setEditingConfig(config)
        setIsFormOpen(true)
    }

    const toggleExpand = (id: string) => {
        setExpandedConfig(expandedConfig === id ? null : id)
    }

    const calculateTotalPrice = (config: PCConfig) => {
        return Object.values(config).reduce((total, component) => {
            if (typeof component === 'object' && 'price' in component) {
                return total + component.price
            }
            return total
        }, 0)
    }

    const filteredAndSortedConfigs = configs
        .filter(config => config.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => {
            if (sortBy === 'name') {
                return sortOrder === 'asc'
                    ? a.name.localeCompare(b.name)
                    : b.name.localeCompare(a.name)
            } else {
                const priceA = calculateTotalPrice(a)
                const priceB = calculateTotalPrice(b)
                return sortOrder === 'asc' ? priceA - priceB : priceB - priceA
            }
        })

    const totalConfigs = configs.length
    const totalValue = configs.reduce((sum, config) => sum + calculateTotalPrice(config), 0)
    const averageValue = totalConfigs > 0 ? totalValue / totalConfigs : 0
    const mostExpensiveConfig = configs.reduce((max, config) => {
        const price = calculateTotalPrice(config)
        return price > calculateTotalPrice(max) ? config : max
    }, configs[0])
    const leastExpensiveConfig = configs.reduce((min, config) => {
        const price = calculateTotalPrice(config)
        return price < calculateTotalPrice(min) ? config : min
    }, configs[0])

    const totalMargin = configs.reduce((sum, config) => sum + (config.saleTarget - calculateTotalPrice(config)), 0)
    const averageMargin = totalConfigs > 0 ? totalMargin / totalConfigs : 0

    return (
        <div className="container mx-auto p-4 max-w-6xl">
            <h1 className="text-3xl font-bold text-blue-900 mb-6 text-center">Gestionnaire de Configurations PC</h1>

            <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold text-blue-800 mb-4">Résumé des Configurations</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg font-medium text-gray-600">Aperçu Général</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <p className="flex justify-between">
                                    <span className="text-gray-500">Total des configurations:</span>
                                    <span className="font-semibold text-blue-600">{totalConfigs}</span>
                                </p>
                                <p className="flex justify-between">
                                    <span className="text-gray-500">Valeur totale:</span>
                                    <span className="font-semibold text-green-600">{totalValue.toFixed(2)} €</span>
                                </p>
                                <p className="flex justify-between">
                                    <span className="text-gray-500">Valeur moyenne:</span>
                                    <span className="font-semibold text-orange-600">{averageValue.toFixed(2)} €</span>
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg font-medium text-gray-600">Configurations Extrêmes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <p className="flex justify-between items-center">
                  <span className="text-gray-500 flex items-center">
                    <Cpu className="w-4 h-4 mr-1" /> Plus chère:
                  </span>
                                    <span className="font-semibold text-red-600">
                    {mostExpensiveConfig ? calculateTotalPrice(mostExpensiveConfig).toFixed(2) + ' €' : 'N/A'}
                  </span>
                                </p>
                                <p className="text-sm text-gray-400 ml-5">
                                    {mostExpensiveConfig ? mostExpensiveConfig.name : 'Aucune configuration'}
                                </p>
                                <p className="flex justify-between items-center mt-2">
                  <span className="text-gray-500 flex items-center">
                    <HardDrive className="w-4 h-4 mr-1" /> Moins chère:
                  </span>
                                    <span className="font-semibold text-green-600">
                    {leastExpensiveConfig ? calculateTotalPrice(leastExpensiveConfig).toFixed(2) + ' €' : 'N/A'}
                  </span>
                                </p>
                                <p className="text-sm text-gray-400 ml-5">
                                    {leastExpensiveConfig ? leastExpensiveConfig.name : 'Aucune configuration'}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg font-medium text-gray-600">Analyse des Marges</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <p className="flex justify-between">
                                    <span className="text-gray-500">Marge totale:</span>
                                    <span className="font-semibold text-blue-600">{totalMargin.toFixed(2)} €</span>
                                </p>
                                <p className="flex justify-between">
                                    <span className="text-gray-500">Marge moyenne:</span>
                                    <span className="font-semibold text-green-600">{averageMargin.toFixed(2)} €</span>
                                </p>
                                <div className="mt-2">
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div
                                            className="bg-blue-600 h-2.5 rounded-full"
                                            style={{ width: `${Math.min(100, (averageMargin / averageValue) * 100)}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">Marge moyenne en % du prix moyen</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-2 sm:space-y-0 sm:space-x-2">
                <Button
                    onClick={() => setIsFormOpen(true)}
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300"
                >
                    <PlusCircle className="mr-2 h-4 w-4" /> Nouvelle Configuration
                </Button>
                <div className="flex w-full sm:w-auto space-x-2">
                    <div className="relative flex-grow">
                        <Input
                            type="text"
                            placeholder="Rechercher..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-8"
                        />
                        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                    <Select value={sortBy} onValueChange={(value: 'name' | 'price') => setSortBy(value)}>
                        <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Trier par" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="name">Nom</SelectItem>
                            <SelectItem value="price">Prix</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    >
                        {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                    </Button>
                </div>
            </div>

            <AnimatePresence>
                {isFormOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                    >
                        <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl max-h-[90vh] overflow-hidden">
                            <PCConfigForm
                                config={editingConfig || undefined}
                                onSave={handleSave}
                                onCancel={() => {
                                    setIsFormOpen(false)
                                    setEditingConfig(null)
                                }}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="space-y-4">
                {filteredAndSortedConfigs.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        {searchTerm ? "Aucune configuration trouvée" : "Aucune configuration enregistrée"}
                    </div>
                ) : (
                    filteredAndSortedConfigs.map(config => (
                        <motion.div
                            key={config.id}
                            initial={false}
                            animate={{ height: expandedConfig === config.id ? 'auto' : 'fit-content' }}
                            transition={{ duration: 0.3 }}
                            className="bg-white rounded-lg shadow-md overflow-hidden"
                        >
                            <div
                                className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50"
                                onClick={() => toggleExpand(config.id)}
                            >
                                <div>
                                    <h2 className="text-xl font-semibold text-blue-900">{config.name}</h2>
                                    <p className="text-sm text-gray-500">
                                        Prix total: {calculateTotalPrice(config).toFixed(2)} €
                                    </p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleEdit(config)
                                        }}
                                        className="hover:bg-blue-50"
                                    >
                                        <Edit className="h-4 w-4 text-blue-600" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleDelete(config.id)
                                        }}
                                        className="hover:bg-red-50"
                                    >
                                        <Trash2 className="h-4 w-4 text-red-600" />
                                    </Button>
                                    {expandedConfig === config.id ? (
                                        <ChevronUp className="h-4 w-4 text-blue-600" />
                                    ) : (
                                        <ChevronDown className="h-4 w-4 text-blue-600" />
                                    )}
                                </div>
                            </div>
                            <AnimatePresence>
                                {expandedConfig === config.id && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="px-4 pb-4"
                                    >
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                            {Object.entries(config).map(([key, value]) => {
                                                if (typeof value === 'object' && value !== null && 'name' in value && 'price' in value) {
                                                    return (
                                                        <div key={key} className="bg-blue-50 p-3 rounded-lg">
                                                            <h3 className="font-semibold text-blue-900 capitalize mb-2">{key}</h3>
                                                            <div className="space-y-1">
                                                                <p className="text-blue-800">
                                                                    <span className="font-medium">Nom:</span> {value.name}
                                                                </p>
                                                                <p className="text-blue-800">
                                                                    <span className="font-medium">Prix:</span> {value.price.toFixed(2)} €
                                                                </p>
                                                                {value.notes && (
                                                                    <p className="text-blue-700 text-xs">
                                                                        <span className="font-medium">Notes:</span> {value.notes}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                                return null
                                            })}
                                        </div>
                                        <div className="mt-4 bg-blue-100 p-4 rounded-lg">
                                            <p className="text-blue-900 font-semibold">Prix total: {calculateTotalPrice(config).toFixed(2)} €</p>
                                            <p className="text-blue-900 font-semibold">Objectif de vente: {config.saleTarget.toFixed(2)} €</p>
                                            <p className={`font-bold ${config.saleTarget - calculateTotalPrice(config) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                Marge: {(config.saleTarget - calculateTotalPrice(config)).toFixed(2)} €
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    )
}