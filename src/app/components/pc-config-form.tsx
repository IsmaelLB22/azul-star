"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronRight, ChevronLeft } from 'lucide-react'

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

const componentOrder = ['name', 'motherboard', 'case', 'powerSupply', 'ram', 'cpu', 'ssd', 'hdd', 'graphicsCard', 'saleTarget']

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
    const [currentStep, setCurrentStep] = useState(0)

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

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, componentOrder.length - 1))
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0))

    const renderStep = (step: string) => {
        if (step === 'name') {
            return (
                <motion.div
                    key="name"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-4"
                >
                    <Label htmlFor="name" className="text-xl font-semibold text-yellow-400">Nom de la configuration</Label>
                    <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="mt-1 w-full bg-orange-100 text-orange-900 placeholder-orange-400 border-orange-300 focus:border-yellow-500 focus:ring-yellow-500 transition-all duration-300"
                        placeholder="Entrez le nom de votre configuration"
                    />
                </motion.div>
            )
        } else if (step === 'saleTarget') {
            return (
                <motion.div
                    key="saleTarget"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-4"
                >
                    <Label htmlFor="saleTarget" className="text-xl font-semibold text-yellow-400">Objectif de vente</Label>
                    <Input
                        id="saleTarget"
                        name="saleTarget"
                        type="number"
                        value={formData.saleTarget}
                        onChange={handleChange}
                        required
                        className="mt-1 w-full bg-orange-100 text-orange-900 placeholder-orange-400 border-orange-300 focus:border-yellow-500 focus:ring-yellow-500 transition-all duration-300"
                        placeholder="Entrez l'objectif de vente"
                    />
                </motion.div>
            )
        } else {
            return (
                <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.5 }}
                >
                    <Card className="overflow-hidden bg-gradient-to-br from-orange-200 to-yellow-100">
                        <CardHeader className="bg-orange-400">
                            <CardTitle className="text-xl text-white">{step.charAt(0).toUpperCase() + step.slice(1)}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 p-6">
                            <div>
                                <Label htmlFor={`${step}-name`} className="text-orange-800">Nom</Label>
                                <Input
                                    id={`${step}-name`}
                                    name="name"
                                    value={formData[step].name}
                                    onChange={(e) => handleChange(e, step)}
                                    required
                                    className="mt-1 w-full bg-orange-50 text-orange-900 placeholder-orange-300 border-orange-200 focus:border-yellow-400 focus:ring-yellow-400 transition-all duration-300"
                                    placeholder={`Nom du ${step}`}
                                />
                            </div>
                            <div>
                                <Label htmlFor={`${step}-price`} className="text-orange-800">Prix</Label>
                                <Input
                                    id={`${step}-price`}
                                    name="price"
                                    type="number"
                                    value={formData[step].price}
                                    onChange={(e) => handleChange(e, step)}
                                    required
                                    className="mt-1 w-full bg-orange-50 text-orange-900 placeholder-orange-300 border-orange-200 focus:border-yellow-400 focus:ring-yellow-400 transition-all duration-300"
                                    placeholder={`Prix du ${step}`}
                                />
                            </div>
                            <div>
                                <Label htmlFor={`${step}-notes`} className="text-orange-800">Notes</Label>
                                <Textarea
                                    id={`${step}-notes`}
                                    name="notes"
                                    value={formData[step].notes || ''}
                                    onChange={(e) => handleChange(e, step)}
                                    className="mt-1 w-full bg-orange-50 text-orange-900 placeholder-orange-300 border-orange-200 focus:border-yellow-400 focus:ring-yellow-400 transition-all duration-300"
                                    placeholder={`Notes pour le ${step}`}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            )
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-gradient-to-br from-orange-500 to-yellow-400 p-6 rounded-xl shadow-2xl">
            <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-white mb-2">Configuration PC</h2>
                <p className="text-yellow-100">Étape {currentStep + 1} sur {componentOrder.length}</p>
            </div>
            <AnimatePresence mode="wait">
                {renderStep(componentOrder[currentStep])}
            </AnimatePresence>
            <div className="flex justify-between mt-8">
                <Button
                    type="button"
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className="bg-yellow-500 hover:bg-yellow-600 text-orange-900 transition-all duration-300"
                >
                    <ChevronLeft className="mr-2 h-4 w-4" /> Précédent
                </Button>
                {currentStep === componentOrder.length - 1 ? (
                    <Button
                        type="submit"
                        className="bg-green-500 hover:bg-green-600 text-white transition-all duration-300"
                    >
                        Enregistrer
                    </Button>
                ) : (
                    <Button
                        type="button"
                        onClick={nextStep}
                        className="bg-yellow-500 hover:bg-yellow-600 text-orange-900 transition-all duration-300"
                    >
                        Suivant <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                )}
            </div>
        </form>
    )
}