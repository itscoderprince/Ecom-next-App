import { ListItemIcon, MenuItem } from '@mui/material'
import { EditIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const EditAction = ({ href }) => {
  return (
    <MenuItem key="edit">
      <Link href={href}>
        <ListItemIcon>
          <EditIcon />
        </ListItemIcon>
        Edit
      </Link>
    </MenuItem>
  )
}

export default EditAction