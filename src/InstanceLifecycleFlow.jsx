import { ReactFlow, Background, Controls } from '@xyflow/react';

export function InstanceLifecycleFlow({ currentStatus }) {
  // Les statuts du cycle de vie
  const statuses = [
    'Draft',
    'ImpactAnalysis',
    'WaitingForValidation',
    'WaitingForProvisionning',
    'OK',
    'Tainted',
    'Failed',
    'Refused'
  ];

  // Création des nœuds VERTICAUX
  // Positionnement vertical, mais Refused est à droite de WaitingForProvisionning
  const nodes = [
    { id: 'Draft', data: { label: 'Draft' }, position: { x: 100, y: 30 } },
    { id: 'ImpactAnalysis', data: { label: 'ImpactAnalysis' }, position: { x: 100, y: 140 } },
    { id: 'WaitingForValidation', data: { label: 'WaitingForValidation' }, position: { x: 100, y: 250 } },
    { id: 'WaitingForProvisionning', data: { label: 'WaitingForProvisionning' }, position: { x: 100, y: 360 } },
    { id: 'Refused', data: { label: 'Refused' }, position: { x: 350, y: 360 } },
    { id: 'OK', data: { label: 'OK' }, position: { x: 0, y: 470 } },
    { id: 'Tainted', data: { label: 'Tainted' }, position: { x: 180, y: 470 } },
    { id: 'Failed', data: { label: 'Failed' }, position: { x: 360, y: 470 } },
  ].map(n => ({
    ...n,
    style: {
      border: n.id === currentStatus ? '2px solid #007bff' : '1px solid #ccc',
      background: n.id === currentStatus ? '#e7f1ff' : '#fff',
      color: n.id === currentStatus ? '#007bff' : '#333',
      borderRadius: 8,
      padding: 10,
      minWidth: 80,
      textAlign: 'center',
    },
  }));

  // Définition explicite des transitions (liens)
  const edges = [
    { id: 'Draft-ImpactAnalysis', source: 'Draft', target: 'ImpactAnalysis', animated: true, style: { stroke: '#007bff' } },
    { id: 'ImpactAnalysis-WaitingForValidation', source: 'ImpactAnalysis', target: 'WaitingForValidation', animated: true, style: { stroke: '#007bff' } },
    { id: 'WaitingForValidation-WaitingForProvisionning', source: 'WaitingForValidation', target: 'WaitingForProvisionning', animated: true, style: { stroke: '#007bff' } },
    { id: 'WaitingForValidation-Refused', source: 'WaitingForValidation', target: 'Refused', animated: true, style: { stroke: '#dc3545' } },
    { id: 'WaitingForProvisionning-OK', source: 'WaitingForProvisionning', target: 'OK', animated: true, style: { stroke: '#28a745' } },
    { id: 'WaitingForProvisionning-Tainted', source: 'WaitingForProvisionning', target: 'Tainted', animated: true, style: { stroke: '#ffc107' } },
    { id: 'WaitingForProvisionning-Failed', source: 'WaitingForProvisionning', target: 'Failed', animated: true, style: { stroke: '#dc3545' } },
  ];

  return (
    <div style={{ width: '100%', height: 600 }}>
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
