import AuthRedirect from "@/components/AuthRedirect"
import { ReactNode } from "react"

const LayoutAuth = ({children}:{children:ReactNode}) => {
  return (
    <AuthRedirect>
      {children}
    </AuthRedirect>
  )
}


export default LayoutAuth