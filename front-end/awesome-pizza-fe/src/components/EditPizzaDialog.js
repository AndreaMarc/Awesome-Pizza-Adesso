
import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from '@mui/material';

const EditPizzaDialog = ({ open, pizza, onClose, onUpdatePizza }) => {
  const [description, setDescription] = useState(pizza.description);

  const handleUpdate = () => {
    onUpdatePizza({ ...pizza, description });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Modifica Pizza</DialogTitle>
      <DialogContent>
        <TextField
          label="Descrizione della pizza"
          variant="outlined"
          fullWidth
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Annulla
        </Button>
        <Button onClick={handleUpdate} color="primary">
          Salva
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditPizzaDialog;