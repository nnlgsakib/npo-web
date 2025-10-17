"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, Loader2 } from "lucide-react"
import { submitMemberRequest } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export function MemberApplyForm() {
  const { toast } = useToast()
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [photo, setPhoto] = useState<File | undefined>(undefined)
  const [form, setForm] = useState({
    name: "",
    fathersName: "",
    mothersName: "",
    region: "",
    institution: "",
    address: "",
    email: "",
    phoneNumber: "",
    whyJoining: "",
    howDidYouFindUs: "",
    hobbies: "",
    particularSkill: "",
    extraCurricularActivities: "",
  })

  const required: (keyof typeof form)[] = [
    'name','fathersName','mothersName','region','institution','address','email','phoneNumber','whyJoining','howDidYouFindUs','hobbies'
  ]

  const onChange = (k: keyof typeof form, v: string) => setForm((p) => ({ ...p, [k]: v }))

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    for (const k of required) {
      if (!form[k].trim()) {
        toast({ title: 'Missing field', description: `${k} is required`, variant: 'destructive' })
        return
      }
    }
    setIsSubmitting(true)
    const res = await submitMemberRequest({ ...form, photo })
    setIsSubmitting(false)
    if (res.ok) {
      toast({ title: 'Request submitted', description: 'We will review your application soon.' })
      router.push('/')
    } else {
      toast({ title: 'Error', description: res.error || 'Submission failed', variant: 'destructive' })
    }
  }

  return (
    <Card className="rounded-2xl border-none shadow-xl bg-white">
      <CardContent className="p-8">
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Name *</Label>
              <Input value={form.name} onChange={(e) => onChange('name', e.target.value)} />
            </div>
            <div>
              <Label>Father's Name *</Label>
              <Input value={form.fathersName} onChange={(e) => onChange('fathersName', e.target.value)} />
            </div>
            <div>
              <Label>Mother's Name *</Label>
              <Input value={form.mothersName} onChange={(e) => onChange('mothersName', e.target.value)} />
            </div>
            <div>
              <Label>Region *</Label>
              <Input value={form.region} onChange={(e) => onChange('region', e.target.value)} />
            </div>
            <div>
              <Label>Institution *</Label>
              <Input value={form.institution} onChange={(e) => onChange('institution', e.target.value)} />
            </div>
            <div>
              <Label>Address *</Label>
              <Input value={form.address} onChange={(e) => onChange('address', e.target.value)} />
            </div>
            <div>
              <Label>Email *</Label>
              <Input type="email" value={form.email} onChange={(e) => onChange('email', e.target.value)} />
            </div>
            <div>
              <Label>Phone Number *</Label>
              <Input value={form.phoneNumber} onChange={(e) => onChange('phoneNumber', e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Why Joining *</Label>
              <Textarea value={form.whyJoining} onChange={(e) => onChange('whyJoining', e.target.value)} />
            </div>
            <div>
              <Label>How Did You Find Us? *</Label>
              <Textarea value={form.howDidYouFindUs} onChange={(e) => onChange('howDidYouFindUs', e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Hobbies *</Label>
              <Input value={form.hobbies} onChange={(e) => onChange('hobbies', e.target.value)} />
            </div>
            <div>
              <Label>Particular Skill</Label>
              <Input value={form.particularSkill} onChange={(e) => onChange('particularSkill', e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <Label>Extra Curricular Activities</Label>
              <Textarea value={form.extraCurricularActivities} onChange={(e) => onChange('extraCurricularActivities', e.target.value)} />
            </div>
          </div>

          <div>
            <Label>Photo</Label>
            <div className="flex gap-3 items-center">
              <Input type="file" ref={fileRef} accept="image/*" onChange={(e) => setPhoto(e.target.files?.[0] || undefined)} />
              <Button type="button" variant="outline" onClick={() => fileRef.current?.click()} className="rounded-xl">
                <Upload className="w-4 h-4 mr-2" /> Upload
              </Button>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting} className="h-12 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-xl">
              {isSubmitting ? (<><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Submitting...</>) : 'Submit Request'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
