type Props = {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export const ConfirmModal = ({ open, onCancel, onConfirm }: Props) => {
  if (!open) return null;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Confirmar limpiar dibujo">
      <div className="confirm-panel">
        <div className="confirm-face">🧽</div>
        <div className="confirm-actions">
          <button className="big-choice cancel" type="button" aria-label="No limpiar" onClick={onCancel}>
            ✨
          </button>
          <button className="big-choice danger" type="button" aria-label="Limpiar dibujo" onClick={onConfirm}>
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
};
