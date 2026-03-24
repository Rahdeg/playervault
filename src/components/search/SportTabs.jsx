import { Button } from "@/components/ui/button"
import { usePreferences } from "@/context/usePreferences"

const sports = ["basketball", "football", "cricket"]

export default function SportTabs() {
  const { sport, setSport } = usePreferences()

  return (
    <div className="flex gap-2 mb-4">
      {sports.map(s => (
        <Button
          key={s}
          variant={sport === s ? "default" : "outline"}
          onClick={() => setSport(s)}
        >
          {s}
        </Button>
      ))}
    </div>
  )
}