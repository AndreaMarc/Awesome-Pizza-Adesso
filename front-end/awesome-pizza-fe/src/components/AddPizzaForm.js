
import React, { useState } from 'react';
import { TextField, Button, Typography } from '@mui/material';

const AddPizzaForm = ({ onCreatePizza }) => {
  const [newPizza, setNewPizza] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreatePizza(newPizza);
    setNewPizza('');
  };

  return (
    <div>
      <Typography variant="h6">Aggiungi una nuova pizza</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Descrizione della pizza"
          variant="outlined"
          fullWidth
          value={newPizza}
          onChange={(e) => setNewPizza(e.target.value)}
          required
        />
        <Button type="submit" variant="contained" color="primary" sx={{ marginTop: 2 }}>
          Aggiungi Pizza
        </Button>
      </form>
    </div>
  );
};

export default AddPizzaForm;