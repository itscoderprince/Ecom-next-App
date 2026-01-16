import { IconButton, Tooltip } from '@mui/material'
import { EditIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const EditAction = ({ href }) => {
  return (
    <Tooltip title="Edit">
      <Link href={href}>
        <IconButton color="primary">
          <EditIcon size={24} />
        </IconButton>
      </Link>
    </Tooltip>
  )
}

export default EditAction