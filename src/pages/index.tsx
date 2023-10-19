import { Inter } from 'next/font/google'
import HistogramChart from "@/pages/HistogramChart";

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
     <HistogramChart />
    </>
  )
}
