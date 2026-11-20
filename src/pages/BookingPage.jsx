import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StepIndicator from '../components/booking/StepIndicator';
import ServiceSelector from '../components/booking/ServiceSelector';
import BarberSelector from '../components/booking/BarberSelector';
import DateStrip from '../components/booking/DateStrip';
import TimeSlotGrid from '../components/booking/TimeSlotGrid';
import ClientDetailsForm from '../components/booking/ClientDetailsForm';
import BookingSummary from '../components/booking/BookingSummary';
import Button from '../components/common/Button';
import { useAvailableSlots } from '../hooks/useAvailableSlots';
import { useAppointments } from '../context/AppointmentContext';
import { useToast } from '../context/ToastContext';
import { validateBookingDraft } from '../utils/validators';
import './BookingPage.css';

const EMPTY_DRAFT = {
  serviceId: '',
  barberId: '',
  date: '',
  time: '',
  clientName: '',
  clientPhone: '',
  notes: '',
};

export default function BookingPage() {
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState(EMPTY_DRAFT);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();
  const { createAppointment } = useAppointments();
  const { show } = useToast();

  const availableSlots = useAvailableSlots({
    serviceId: draft.serviceId,
    barberId: draft.barberId,
    date: draft.date,
  });

  function updateDraft(key, value) {
    setDraft((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function selectService(serviceId) {
    // Trocar o serviço pode invalidar o horário já escolhido (duração muda).
    setDraft((prev) => ({ ...prev, serviceId, time: '' }));
  }

  function selectBarber(barberId) {
    setDraft((prev) => ({ ...prev, barberId, date: '', time: '' }));
  }

  function selectDate(date) {
    setDraft((prev) => ({ ...prev, date, time: '' }));
  }

  function canAdvance() {
    if (step === 1) return !!draft.serviceId;
    if (step === 2) return !!draft.barberId;
    if (step === 3) return !!draft.date && !!draft.time;
    return true;
  }

  function goNext() {
    if (!canAdvance()) return;
    setStep((s) => Math.min(s + 1, 4));
  }

  function goBack() {
    setStep((s) => Math.max(s - 1, 1));
  }

  async function handleSubmit() {
    const { valid, errors: validationErrors } = validateBookingDraft(draft);
    if (!valid) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    const result = createAppointment(draft);
    setSubmitting(false);

    if (result.success) {
      navigate('/confirmacao', { state: { appointment: result.appointment } });
    } else {
      show(result.error || 'Não foi possível concluir o agendamento.', 'error');
      // horário pode ter sido ocupado por outra pessoa — volta pro passo 3
      setStep(3);
    }
  }

  return (
    <div className="container booking-page">
      <div className="booking-page__intro">
        <span className="eyebrow">Agende seu horário</span>
        <h1>Marque com o barbeiro certo, no horário que funciona pra você</h1>
      </div>

      <div className="booking-page__layout">
        <div className="booking-page__main">
          <StepIndicator currentStep={step} />

          {step === 1 && (
            <section className="booking-step">
              <h3>Escolha o serviço</h3>
              <ServiceSelector selectedId={draft.serviceId} onSelect={selectService} />
            </section>
          )}

          {step === 2 && (
            <section className="booking-step">
              <h3>Escolha o profissional</h3>
              <BarberSelector selectedId={draft.barberId} onSelect={selectBarber} />
            </section>
          )}

          {step === 3 && (
            <section className="booking-step">
              <h3>Escolha a data</h3>
              <DateStrip
                selectedDate={draft.date}
                onSelect={selectDate}
                barberId={draft.barberId}
              />

              {draft.date && (
                <>
                  <h3 className="booking-step__subtitle">Horários disponíveis</h3>
                  <TimeSlotGrid
                    slots={availableSlots}
                    selectedTime={draft.time}
                    onSelect={(time) => updateDraft('time', time)}
                  />
                </>
              )}
            </section>
          )}

          {step === 4 && (
            <section className="booking-step">
              <h3>Seus dados</h3>
              <ClientDetailsForm values={draft} errors={errors} onChange={updateDraft} />
            </section>
          )}

          <div className="booking-step__nav">
            {step > 1 && (
              <Button variant="ghost" onClick={goBack} disabled={submitting}>
                Voltar
              </Button>
            )}
            <div className="booking-step__nav-spacer" />
            {step < 4 ? (
              <Button onClick={goNext} disabled={!canAdvance()}>
                Continuar
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={submitting}>
                {submitting ? 'Confirmando...' : 'Confirmar agendamento'}
              </Button>
            )}
          </div>
        </div>

        <BookingSummary draft={draft} />
      </div>
    </div>
  );
}
