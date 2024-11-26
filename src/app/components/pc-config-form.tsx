"use client"

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronRight, ChevronLeft, Tag, CircuitBoardIcon as Motherboard, Box, Zap, MemoryStickIcon as Memory, Cpu, HardDrive, Database, CpuIcon as Gpu, DollarSign, X } from 'lucide-react'

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

const componentOrder: (keyof PCConfig)[] = ['name', 'motherboard', 'case', 'powerSupply', 'ram', 'cpu', 'ssd', 'hdd', 'graphicsCard', 'saleTarget']

const componentIcons = {
    name: Tag,
    motherboard: Motherboard,
    case: Box,
    powerSupply: Zap,
    ram: Memory,
    cpu: Cpu,
    ssd: HardDrive,
    hdd: Database,
    graphicsCard: Gpu,
    saleTarget: DollarSign
}

const initialConfig: PCConfig = {
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

export default function PCConfigForm({ config, onSave, onCancel }: PCConfigFormProps) {
    const [formData, setFormData] = useState<PCConfig>(config || initialConfig)
    const [currentStep, setCurrentStep] = useState(0)
    const [totalPrice, setTotalPrice] = useState(0)
    const [margin, setMargin] = useState(0)
    const buttonRefs = useRef<(HTMLButtonElement | null)[]>([])

    useEffect(() => {
        const newTotalPrice = calculateTotalPrice(formData)
        setTotalPrice(newTotalPrice)
        setMargin(formData.saleTarget - newTotalPrice)
    }, [formData])

    useEffect(() => {
        scrollToButton(currentStep)
    }, [currentStep])

    const calculateTotalPrice = (config: PCConfig): number => {
        return Object.entries(config).reduce((total, [, value]) => {
            if (typeof value === 'object' && value !== null && 'price' in value) {
                return total + (typeof value.price === 'number' ? value.price : 0)
            }
            return total
        }, 0)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, component?: keyof PCConfig) => {
        const { name, value } = e.target

        setFormData(prev => {
            if (component && component !== 'name' && component !== 'saleTarget') {
                const componentData = prev[component] as Component
                return {
                    ...prev,
                    [component]: {
                        ...componentData,
                        [name]: name === 'price' ? parseFloat(value) || 0 : value,
                    },
                }
            } else {
                return {
                    ...prev,
                    [name]: name === 'saleTarget' ? parseFloat(value) || 0 : value,
                }
            }
        })
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSave(formData)
    }

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, componentOrder.length - 1))
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0))

    const scrollToButton = (index: number) => {
        const button = buttonRefs.current[index]
        if (button) {
            button.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'center'
            })
        }
    }

    const renderStep = (step: keyof PCConfig) => {
        if (step === 'name') {
            return (
                <motion.div
                    key="name"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-2"
                >
                    <Label htmlFor="name" className="text-sm font-semibold text-blue-900">Nom de la configuration</Label>
                    <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="mt-1 w-full bg-white text-blue-900 placeholder-blue-400 border-blue-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300 py-1"
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
                    className="space-y-2"
                >
                    <Label htmlFor="saleTarget" className="text-sm font-semibold text-blue-900">Objectif de vente</Label>
                    <Input
                        id="saleTarget"
                        name="saleTarget"
                        type="number"
                        value={formData.saleTarget}
                        onChange={handleChange}
                        required
                        className="mt-1 w-full bg-white text-blue-900 placeholder-blue-400 border-blue-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300 py-1"
                        placeholder="Entrez l'objectif de vente"
                    />
                </motion.div>
            )
        } else {
            const component = formData[step] as Component
            return (
                <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.5 }}
                >
                    <Card className="overflow-hidden bg-white shadow-md">
                        <CardHeader className="bg-blue-50 py-2">
                            <CardTitle className="text-lg text-blue-900">{step.charAt(0).toUpperCase() + step.slice(1)}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 p-4">
                            <div>
                                <Label htmlFor={`${step}-name`} className="text-sm text-blue-800">Nom</Label>
                                <Input
                                    id={`${step}-name`}
                                    name="name"
                                    value={component.name}
                                    onChange={(e) => handleChange(e, step)}
                                    required
                                    className="mt-1 w-full bg-white text-blue-900 placeholder-blue-400 border-blue-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300 py-1"
                                    placeholder={`Nom du ${step}`}
                                />
                            </div>
                            <div>
                                <Label htmlFor={`${step}-price`} className="text-sm text-blue-800">Prix</Label>
                                <Input
                                    id={`${step}-price`}
                                    name="price"
                                    type="number"
                                    value={component.price}
                                    onChange={(e) => handleChange(e, step)}
                                    required
                                    className="mt-1 w-full bg-white text-blue-900 placeholder-blue-400 border-blue-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300 py-1"
                                    placeholder={`Prix du ${step}`}
                                />
                            </div>
                            <div>
                                <Label htmlFor={`${step}-notes`} className="text-sm text-blue-800">Notes</Label>
                                <Textarea
                                    id={`${step}-notes`}
                                    name="notes"
                                    value={component.notes || ''}
                                    onChange={(e) => handleChange(e, step)}
                                    className="mt-1 w-full bg-white text-blue-900 placeholder-blue-400 border-blue-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300 py-1"
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
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md lg:flex lg:flex-col relative w-full max-w-3xl mx-auto h-[calc(100vh-4rem)] overflow-y-auto">
            <Button
                type="button"
                onClick={onCancel}
                className="absolute top-2 right-2 p-2 text-gray-500 hover:text-gray-700"
                variant="ghost"
            >
                <X className="h-6 w-6" />
                <span className="sr-only">Fermer</span>
            </Button>
            <div className="text-center mb-4 lg:text-left">
                <h2 className="text-xl font-bold text-blue-900 mb-2">Configuration PC</h2>
                <p className="text-blue-600 text-sm">Étape {currentStep + 1} sur {componentOrder.length}</p>
            </div>
            <div className="lg:flex lg:space-x-4 flex-grow overflow-hidden">
                <div className="lg:w-1/3 mb-4 lg:mb-0">
                    <div className="flex flex-nowrap lg:flex-col justify-start gap-2 mb-4 overflow-x-auto pb-2 sm:flex-wrap sm:justify-center lg:h-full lg:overflow-y-auto hide-scrollbar">
                        {componentOrder.map((step, index) => {
                            const Icon = componentIcons[step]
                            return (
                                <Button
                                    key={step}
                                    type="button"
                                    onClick={() => {
                                        setCurrentStep(index)
                                        scrollToButton(index)
                                    }}
                                    ref={(el: HTMLButtonElement | null) => {
                                        buttonRefs.current[index] = el
                                    }}
                                    variant={currentStep === index ? "default" : "outline"}
                                    className={`transition-all duration-300 flex-shrink-0 lg:w-full text-sm ${
                                        currentStep === index
                                            ? "bg-blue-600 text-white"
                                            : "bg-white text-blue-600 hover:bg-blue-50"
                                    }`}
                                >
                                    <Icon className="w-4 h-4 mr-1" />
                                    <span className="hidden sm:inline">{step.charAt(0).toUpperCase() + step.slice(1)}</span>
                                </Button>
                            )
                        })}
                    </div>
                </div>
                <div className="lg:w-2/3 lg:flex lg:flex-col lg:justify-between overflow-y-auto">
                    <AnimatePresence mode="wait">
                        {renderStep(componentOrder[currentStep])}
                    </AnimatePresence>
                    <div className="mt-3 bg-blue-50 p-2 rounded-lg shadow-inner text-xs">
                        <p className="text-blue-800 font-semibold text-sm">Prix total: {totalPrice.toFixed(2)} €</p>
                        <p className="text-blue-800 font-semibold text-sm">Objectif de vente: {formData.saleTarget.toFixed(2)} €</p>
                        <p className={`font-bold text-sm ${margin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            Marge: {margin.toFixed(2)} €
                        </p>
                    </div>
                </div>
            </div>
            <div className="flex justify-between mt-4 flex-col sm:flex-row gap-2">
                <Button
                    type="button"
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className="w-full sm:w-auto bg-blue-100 hover:bg-blue-200 text-blue-800 transition-all duration-300"
                >
                    <ChevronLeft className="mr-2 h-4 w-4" /> Précédent
                </Button>
                {currentStep === componentOrder.length - 1 ? (
                    <Button
                        type="submit"
                        className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white transition-all duration-300"
                    >
                        Enregistrer
                    </Button>
                ) : (
                    <Button
                        type="button"
                        onClick={nextStep}
                        className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300"
                    >
                        Suivant <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                )}
            </div>
        </form>
    )
}