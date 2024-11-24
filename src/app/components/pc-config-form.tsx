"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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

type PCConfigFormProps = {
    config?: PCConfig
    onSave: (config: PCConfig) => void
    onCancel: () => void
}

export default function PCConfigForm({ config, onSave, onCancel }: PCConfigFormProps) {
    const [formData, setFormData] = useState<PCConfig>(
        config || {
            id: Date.now().toString(),
            name: '',
            motherboard: { name: '', price: 0 },
            case: { name: '', price: 0 },
            powerSupply: { name: '', price: 0 },
            ram: { name: '', price: 0 },
            cpu: { name: '', price: 0 },
            ssd: { name: '', price: 0 },
            hdd: { name: '', price: 0 },
            graphicsCard: { name: '', price: 0 },
            saleTarget: 0,
        }
    )

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, component?: string) => {
        const { name, value } = e.target
        if (component) {
            setFormData(prev => ({
                ...prev,
                [component]: {
                    ...prev[component],
                    [name]: name === 'price' ? parseFloat(value) || 0 : value,
                },
            }))
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: name === 'saleTarget' ? parseFloat(value) || 0 : value,
            }))
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSave(formData)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Label htmlFor="name" className="text-lg font-semibold">Nom de la configuration</Label>
                <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="mt-1 w-full transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                />
            </motion.div>
            {['motherboard', 'case', 'powerSupply', 'ram', 'cpu', 'ssd', 'hdd', 'graphicsCard'].map((component, index) => (
                <motion.div
                    key={component}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                    <Card className="overflow-hidden">
                        <CardHeader>
                            <CardTitle className="text-lg">{component.charAt(0).toUpperCase() + component.slice(1)}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor={`${component}-name`}>Nom</Label>
                                <Input
                                    id={`${component}-name`}
                                    name="name"
                                    value={formData[component].name}
                                    onChange={(e) => handleChange(e, component)}
                                    required
                                    className="mt-1 w-full transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <Label htmlFor={`${component}-price`}>Prix</Label>
                                <Input
                                    id={`${component}-price`}
                                    name="price"
                                    type="number"
                                    value={formData[component].price}
                                    onChange={(e) => handleChange(e, component)}
                                    required
                                    className="mt-1 w-full transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <Label htmlFor={`${component}-notes`}>Notes</Label>
                                <Textarea
                                    id={`${component}-notes`}
                                    name="notes"
                                    value={formData[component].notes || ''}
                                    onChange={(e) => handleChange(e, component)}
                                    className="mt-1 w-full transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
            >
                <Label htmlFor="saleTarget" className="text-lg font-semibold">Objectif de vente</Label>
                <Input
                    id="saleTarget"
                    name="saleTarget"
                    type="number"
                    value={formData.saleTarget}
                    onChange={handleChange}
                    required
                    className="mt-1 w-full transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                />
            </motion.div>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.9 }}
                className="flex justify-end space-x-4"
            >
                <Button type="button" variant="outline" onClick={onCancel} className="transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    Annuler
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300">
                    Enregistrer
                </Button>
            </motion.div>
        </form>
    )
}