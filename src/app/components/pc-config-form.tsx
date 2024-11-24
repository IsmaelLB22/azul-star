"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

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
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="name">Nom de la configuration</Label>
                <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
            </div>
            {['motherboard', 'case', 'powerSupply', 'ram', 'cpu', 'ssd', 'hdd', 'graphicsCard'].map((component) => (
                <div key={component} className="space-y-2">
                    <Label>{component.charAt(0).toUpperCase() + component.slice(1)}</Label>
                    <Input
                        name="name"
                        placeholder="Nom"
                        value={formData[component].name}
                        onChange={(e) => handleChange(e, component)}
                        required
                    />
                    <Input
                        name="price"
                        type="number"
                        placeholder="Prix"
                        value={formData[component].price}
                        onChange={(e) => handleChange(e, component)}
                        required
                    />
                    <Textarea
                        name="notes"
                        placeholder="Notes"
                        value={formData[component].notes || ''}
                        onChange={(e) => handleChange(e, component)}
                    />
                </div>
            ))}
            <div>
                <Label htmlFor="saleTarget">Objectif de vente</Label>
                <Input
                    id="saleTarget"
                    name="saleTarget"
                    type="number"
                    value={formData.saleTarget}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={onCancel}>Annuler</Button>
                <Button type="submit">Enregistrer</Button>
            </div>
        </form>
    )
}