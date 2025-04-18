import { ProtectedRoute } from "@/components/ProtectedRoute"
import { ReactNode } from "react"

const LayoutOrder = ({children}:{children:ReactNode}) => {
  return (
    <ProtectedRoute>
      {children}
    </ProtectedRoute>
  )
}

export default LayoutOrder