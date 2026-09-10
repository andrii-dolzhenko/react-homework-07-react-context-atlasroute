import { memo } from 'react'
import { useAppContext } from '../context/AppContext'
import { formatArea } from '../utils/units'

function AreaValue({ areaKm2 }) {
  const { unitSystem } = useAppContext()

  return formatArea(areaKm2, unitSystem)
}

export default memo(AreaValue)
