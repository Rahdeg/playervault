import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

export default function CompareBar({ selected }) {
  const navigate = useNavigate()

  if (selected.length < 2) return null

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-white shadow p-4 rounded flex gap-4">

      <span>
        {selected[0].name} vs {selected[1].name}
      </span>

      <Button
        onClick={() =>
          navigate(`/compare?id1=${selected[0].id}&id2=${selected[1].id}`)
        }
      >
        Compare
      </Button>

    </div>
  )
}