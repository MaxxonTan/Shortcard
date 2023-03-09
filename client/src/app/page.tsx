import Button from "@/components/button"
import { supabase } from "@/lib/supabaseClient"

export default async function Home() {

  return (
    <main>
      <p>Components</p>
      <Button/>
    </main>
  )
}
