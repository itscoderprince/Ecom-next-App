import { Delete } from '@mui/icons-material'
import { IconButton, Tooltip } from '@mui/material'
import React from 'react'

const DeleteAction = ({ handleDelete, row, deleteType }) => {
  return (
    <Tooltip title="Delete">
      <IconButton color="error" onClick={() => handleDelete([row.original._id], deleteType)}>
        <Delete size={24} />
      </IconButton>
    </Tooltip>
  )
}

export default DeleteAction