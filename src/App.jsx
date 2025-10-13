import { useRef } from 'react'
import { Button } from './components/ui/button'
import { ToggleBadge } from './components/ui/badge'
import { FieldLabel, Field } from './components/ui/field'
import { Check, ChevronDown } from 'lucide-react'


function App() {
  return (
    <>
      <div className="p-4 bg-white rounded-xl shadow-lg w-[296px]">
      <div className="flex flex-col justify-center gap-4">
        <div className="flex flex-row items-center justify-center gap-4">
          <Button size="sm" className="bg-[#ececec] hover:bg-[#ececec]">Notifications</Button>
          <Button size="sm" className="bg-[#ececec] hover:bg-[#ececec]">Settings</Button>
        </div>
        <div className="h-px bg-[#ececec] my-1 w-full"/>
        <Field className="!gap-1.5">
          <FieldLabel className="text-[#989494]">CITY</FieldLabel>
          <div className="relative w-full inline-block">
          <select
            name="city"
            className="w-full rounded-xl border border-[#ececec] px-4.5 py-1.25 placeholder-text-[#989494] focus:outline-none focus:4px focus:ring-blue-500 focus:border-blue-500 appearance-none"
          >
            <option value="" disabled>Select City</option>
            <option value="calgary">Calgary</option>
            <option value="edmonton">Edmonton</option>
            <option value="guelph">Guelph</option>
            <option value="hamilton">Hamilton</option>
            <option value="london">London</option>
            <option value="montreal">Montreal</option>
            <option value="ottawa">Ottawa</option>
            <option value="toronto">Toronto</option>
            <option value="waterloo" selected>Waterloo</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-3.5 flex items-center">
            <ChevronDown className="h-4 w-4 text-[#989494]"/>
          </div>
          </div>
        </Field>
        <Field className="!gap-1.5">
          <FieldLabel className="text-[#989494]">START TERM</FieldLabel>
          <div className="flex flex-row gap-2">
            <ToggleBadge label="Fall"></ToggleBadge>
            <ToggleBadge label="Winter"></ToggleBadge>
            <ToggleBadge label="Spring"></ToggleBadge>
          </div>
        </Field>
        <Field className="!gap-1.5">
          <FieldLabel className="text-[#989494]">GENDER</FieldLabel>
          <div className="flex flex-row gap-2">
            <ToggleBadge label="Coed"></ToggleBadge>
            <ToggleBadge label="Female"></ToggleBadge>
            <ToggleBadge label="Male"></ToggleBadge>
          </div>
        </Field>
        <Field className="!gap-1.5">
          <FieldLabel className="text-[#989494]">LEASE TYPE</FieldLabel>
          <div className="flex flex-row gap-2">
            <ToggleBadge label="4 month"></ToggleBadge>
            <ToggleBadge label="8 month"></ToggleBadge>
            <ToggleBadge label="Lease"></ToggleBadge>
          </div>
        </Field>
        <Field className="!gap-1.5">
          <FieldLabel className="text-[#989494]">MAX PRICE</FieldLabel>
          <input 
          type="number" 
          min="0" 
          step="50"
          max="5000"
          name="max price" 
          placeholder="None"
          className="rounded-xl border border-[#ececec] px-4.5 py-1.25 placeholder:text-[#989494] focus:outline-none focus:4px focus:ring-blue-500 focus:border-blue-500"/>
        </Field>
        <div className="h-px bg-[#ececec] my-1 w-full" />
        <div className="flex flex-row gap-4 items-end w-full">
          <Field className="!gap-1.5">
            <FieldLabel className="text-[#989494]">NOTIFY ME EVERY</FieldLabel>
            <div className="w-full relative inline-block">
          <select
            name="frequency"
            className="w-full rounded-xl border border-[#ececec] px-4.5 py-1.25 placeholder:text-[#989494] focus:outline-none focus:4px focus:ring-blue-500 focus:border-blue-500 appearance-none"
          >
            <option value="" disabled>Select Frequency</option>
            <option value="6">6 hours</option>
            <option value="12">12 hours</option>
            <option value="24">24 hours</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-3.5 flex items-center">
            <ChevronDown className="h-4 w-4 text-[#989494]"/>
          </div>
          </div>
          </Field>
          <Button size="icon" className="bg-[#ececec] hover:bg-[#ececec] !rounded-xl"><Check strokeWidth={3}/></Button>
        </div>
      </div>
      </div>
    </>
  )
}

export default App
