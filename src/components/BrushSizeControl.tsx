type Props = {
  size: number;
  onChange: (size: number) => void;
};

export const BrushSizeControl = ({ size, onChange }: Props) => (
  <label className="brush-size" aria-label="Tamaño del pincel">
    <span style={{ width: size, height: size }} />
    <input
      type="range"
      min="8"
      max="54"
      step="2"
      value={size}
      onChange={(event) => onChange(Number(event.currentTarget.value))}
    />
  </label>
);
