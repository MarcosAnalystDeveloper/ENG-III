import { formatPhoneMask } from '../../utils/validators';
import './ClientDetailsForm.css';

export default function ClientDetailsForm({ values, errors, onChange }) {
  const handlePhoneChange = (e) => {
    onChange('clientPhone', formatPhoneMask(e.target.value));
  };

  return (
    <div className="client-form">
      <label className="field">
        <span className="field__label">Nome completo *</span>
        <input
          type="text"
          placeholder="Ex.: João Pereira"
          value={values.clientName}
          onChange={(e) => onChange('clientName', e.target.value)}
        />
        {errors.clientName && <span className="field__error">{errors.clientName}</span>}
      </label>

      <label className="field">
        <span className="field__label">Telefone / WhatsApp *</span>
        <input
          type="tel"
          placeholder="(11) 91234-5678"
          value={values.clientPhone}
          onChange={handlePhoneChange}
        />
        {errors.clientPhone && <span className="field__error">{errors.clientPhone}</span>}
      </label>

      <label className="field">
        <span className="field__label">Observações (opcional)</span>
        <textarea
          rows={3}
          placeholder="Alguma preferência pro corte ou barba?"
          value={values.notes}
          onChange={(e) => onChange('notes', e.target.value)}
        />
      </label>
    </div>
  );
}
