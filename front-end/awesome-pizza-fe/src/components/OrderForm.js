import React from 'react';
import { TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, Select, MenuItem, Chip } from '@mui/material';

const OrderForm = ({
  open,
  onClose,
  onCreate,
  nickname,
  setNickname,
  status,
  setStatus, // Add this line
  pizzas,
  selectedPizzas,
  handleAddPizza,
  handleRemovePizza
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Crea Nuovo Ordine</DialogTitle>
      <DialogContent>
        <TextField
          label="Nickname"
          variant="outlined"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          fullWidth
          margin="normal"
        />
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Status</InputLabel>
          <Select
            value={status}
            label="Status"
            onChange={(e) => setStatus(e.target.value)}
          >
            <MenuItem value={1}>In elaborazione</MenuItem>
            <MenuItem value={2}>Completato</MenuItem>
            <MenuItem value={3}>Annullato</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>Pizze</InputLabel>
          <Select
            value=""
            onChange={(e) => handleAddPizza(e.target.value)}
            label="Seleziona Pizze"
          >
            {pizzas.map((pizza) => (
              <MenuItem key={pizza.id} value={pizza.id}>{pizza.description}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <div style={{ marginTop: 10 }}>
          {selectedPizzas.map((pizzaName, index) => (
            <Chip
              key={index}
              label={pizzaName}
              onDelete={() => handleRemovePizza(pizzaName)}
              style={{ marginRight: 8, marginBottom: 8 }}
            />
          ))}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Annulla
        </Button>
        <Button onClick={onCreate} color="secondary">
          Crea Ordine
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrderForm;