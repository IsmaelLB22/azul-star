"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { PlusCircle, Trash2, Edit, ChevronDown, ChevronUp } from 'lucide-react'
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

export default function PCConfigManager() {
    const [configs, setConfigs] = useState<PCConfig[]>([])
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingConfig, setEditingConfig] = useState<PCConfig | null>(null)
    const [expandedConfig, setExpandedConfig] = useState<string | null>(null)

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

    return (
        <div className="container mx-auto p-4 max-w-4xl">
            <h1 className="text-3xl font-bold text-blue-900 mb-6 text-center">Gestionnaire de Configurations PC</h1>
            <Button
                onClick={() => setIsFormOpen(true)}
                className="mb-4 bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300"
            >
                <PlusCircle className="mr-2 h-4 w-4" /> Nouvelle Configuration
            </Button>
            <AnimatePresence>
                {isFormOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <PCConfigForm
                            config={editingConfig || undefined}
                            onSave={handleSave}
                            onCancel={() => {
                                setIsFormOpen(false)
                                setEditingConfig(null)
                            }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
            <div className="space-y-4">
                {configs.map(config => (
                    <motion.div
                        key={config.id}
                        initial={false}
                        animate={{ height: expandedConfig === config.id ? 'auto' : 'fit-content' }}
                        transition={{ duration: 0.3 }}
                        className="bg-white rounded-lg shadow-md overflow-hidden"
                    >
                        <div
                            className="p-4 flex justify-between items-center cursor-pointer"
                            onClick={() => toggleExpand(config.id)}
                        >
                            <h2 className="text-xl font-semibold text-blue-900">{config.name}</h2>
                            <div className="flex items-center space-x-2">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleEdit(config)
                                    }}
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
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        {Object.entries(config).map(([key, value]) => {
                                            if (typeof value === 'object' && value !== null && 'name' in value && 'price' in value) {
                                                return (
                                                    <div key={key} className="bg-blue-50 p-2 rounded">
                                                        <h3 className="font-semibold text-blue-900 capitalize">{key}</h3>
                                                        <p className="text-blue-800">{value.name}</p>
                                                        <p className="text-blue-700">{value.price.toFixed(2)} €</p>
                                                    </div>
                                                )
                                            }
                                            return null
                                        })}
                                    </div>
                                    <div className="mt-4 bg-blue-100 p-3 rounded-lg">
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
                ))}
            </div>
        </div>
    )
}