import { ListItemIcon, MenuItem } from '@mui/material'
import { DeleteIcon } from 'lucide-react'
import React from 'react'

const DeleteAction = ({ handleDelete, row, deleteType }) => {
  return (
    <MenuItem key="delete" onClick={() => handleDelete([row.original._id], deleteType)}>
      <ListItemIcon>
        <DeleteIcon />
      </ListItemIcon>
      Delete
    </MenuItem>
  )
}

export default DeleteAction