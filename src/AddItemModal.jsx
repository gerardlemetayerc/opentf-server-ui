import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

export default function AddItemModal({ show, onHide, items, onSelect, title, placeholder }) {
  const [search, setSearch] = useState("");
  const filtered = items.filter(i => i.nom.toLowerCase().includes(search.toLowerCase()));
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Control
          type="text"
          placeholder={placeholder}
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="mb-3"
        />
        <div style={{ maxHeight: 250, overflowY: 'auto' }}>
          {filtered.length === 0 && <div className="text-muted">Aucun résultat</div>}
          {filtered.map(item => (
            <Button
              key={item.id}
              variant="outline-primary"
              className="w-100 mb-2 text-start"
              onClick={() => onSelect(item)}
            >
              {item.nom}
            </Button>
          ))}
        </div>
      </Modal.Body>
    </Modal>
  );
}
