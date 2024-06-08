import { Button } from '@material-tailwind/react';
import React, { useLayoutEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Table from '../../components/Table';
import { HttpException } from '../../exceptions';
import { ApiService } from '../../services';
import { Journey } from '../../types/journey.entity';
import { EventType } from '../../types/event-type.enum';

const DriverScreen = () => {
  const navigate = useNavigate();

  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [startedJourney, setStartedJourney] = useState<Journey>();

  const loadJourneys = async () => {
    try {
      const { data } = await ApiService.get<{ data: Journey[] }>(
        `/journeys/ongoing`,
      );

      setJourneys(data);
    } catch (e) {
      let message = 'unexpected error';

      if (e instanceof HttpException) {
        message = e.body?.message || message;
      }

      toast.error(message);
    }
  };

  const loadStartedJourney = async () => {
    try {
      const journey = await ApiService.get<Journey>(`/journeys/current`);

      setStartedJourney(journey || undefined);
    } catch (e) {
      let message = 'unexpected error';

      if (e instanceof HttpException) {
        message = e.body?.message || message;
      }

      toast.error(message);
    }
  };

  useLayoutEffect(() => {
    loadJourneys();
    loadStartedJourney();
  }, []);

  const logout = async () => {
    try {
      await ApiService.delete(`/auth/logout`);
      localStorage.removeItem('accessToken');
      navigate('/login');
    } catch (e) {
      let message = 'unexpected error';

      if (e instanceof HttpException) {
        message = e.body?.message || message;
      }

      toast.error(message);
    }
  };

  const handleTrackOnboard = async (id: string) => {
    if (!startedJourney) return;

    try {
      await ApiService.post('/events', {
        invoiceId: id,
        type: EventType.ONBOARD,
        journeyId: startedJourney.id,
      });

      await loadStartedJourney();
      await loadJourneys();
    } catch (e) {
      let message = 'unexpected error';

      if (e instanceof HttpException) {
        message = e.body?.message || message;
      }

      toast.error(message);
    }
  };

  const handleTrackTransitioned = async (id: string) => {
    if (!startedJourney) return;

    try {
      await ApiService.post('/events', {
        invoiceId: id,
        type: EventType.TRANSITIONED,
        journeyId: startedJourney.id,
      });

      await loadStartedJourney();
      await loadJourneys();
    } catch (e) {
      let message = 'unexpected error';

      if (e instanceof HttpException) {
        message = e.body?.message || message;
      }

      toast.error(message);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between gap-2">
        <Button onClick={logout}>Logout</Button>
      </div>

      {startedJourney ? (
        <div className="w-full">
          <div>Started journed {startedJourney.id}</div>
          <div>
            {startedJourney.transition.sourcePlace.name} {'->'}{' '}
            {startedJourney.transition.targetPlace.name}
          </div>

          <Table
            data={startedJourney.invoices || []}
            headers={['Invoice id', 'Route', 'Status', 'Actions']}
            generateRow={(item) => [
              <>{item.id}</>,
              <>
                {item.senderDepartment.name} {'->'}{' '}
                {item.receiverDepartment.name}
              </>,
              <>
                {item.isInJourney
                  ? 'Onboard'
                  : item.currentPlace?.id ===
                    startedJourney.transition.sourcePlace.id
                  ? 'Awaiting for onboarding'
                  : 'Delivered'}
              </>,
              <div className="flex justify-center items-center gap-2">
                {item.isInJourney ? (
                  <Button onClick={() => handleTrackTransitioned(item.id)}>
                    Track transitioned
                  </Button>
                ) : item.currentPlace?.id ===
                  startedJourney.transition.sourcePlace.id ? (
                  <Button onClick={() => handleTrackOnboard(item.id)}>
                    Track onboard
                  </Button>
                ) : (
                  '-'
                )}
              </div>,
            ]}
          />
        </div>
      ) : (
        <Table
          data={journeys}
          headers={['Journey id', 'Route', 'Actions']}
          generateRow={(item) => [
            <>{item.id}</>,
            <>
              {item.transition.sourcePlace.name} {'->'}{' '}
              {item.transition.targetPlace.name}
            </>,
            <div className="flex justify-center items-center gap-2">
              <Button
                onClick={async () => {
                  await ApiService.patch(`/journeys/${item.id}/start`);
                  window.location.reload();
                }}
              >
                Start
              </Button>
            </div>,
          ]}
        />
      )}
    </div>
  );
};

export default DriverScreen;
