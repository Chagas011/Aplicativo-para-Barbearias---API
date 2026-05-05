import { BarberRepository } from "@/infra/database/dynamo/repositories/BarberRepository";
import { SchedulingRepository } from "@/infra/database/dynamo/repositories/SchedulingRepository";
import { ServiceRepository } from "@/infra/database/dynamo/repositories/ServiceRepository";
import { Injectable } from "@/kernel/decorators/Injectable";

@Injectable()
export class ListAvailableTimesUseCase {
  constructor(
    private readonly schedulingRepository: SchedulingRepository,
    private readonly serviceRepository: ServiceRepository,
    private readonly barberRepository: BarberRepository,
  ) {}

  async execute({
    barberId,
    serviceId,
    barbershopId,
    date,
  }: ListAvailableTimesUseCase.Input): Promise<ListAvailableTimesUseCase.Output> {
    const service = await this.serviceRepository.findById(barberId, serviceId);

    if (!service) {
      throw new Error("Service not found");
    }

    const barber = await this.barberRepository.findById(barbershopId, barberId);

    if (!barber) {
      throw new Error("Barber not found");
    }

    const existingScheduling =
      await this.schedulingRepository.listByBarberAndDate(barberId, date);

    const [year, month, day] = date.split("-").map(Number);
    const dayOfWeek = new Date(year, month - 1, day).getDay();

    const workingDay = barber.workingHours.find(
      (d) => d.dayOfWeek === dayOfWeek,
    );

    if (!workingDay) {
      return { availableTimes: [] };
    }

    const duration = service.duration;
    const buffer = 10;

    const availableTimes: string[] = [];

    const startDate = new Date(
      year,
      month - 1,
      day,
      ...workingDay.start.split(":").map(Number),
    );
    const endDate = new Date(
      year,
      month - 1,
      day,
      ...workingDay.end.split(":").map(Number),
    );

    const now = new Date();

    const validScheduling = existingScheduling.filter(
      (s) => s.status !== "CANCELLED",
    );

    // 7. Converter para minutos (performance)
    const busySlots = validScheduling.map((s) => ({
      start: this.toMinutes(s.startTime),
      end: this.toMinutes(s.endTime),
    }));

    const current = new Date(startDate);

    while (current < endDate) {
      const next = new Date(current);
      next.setMinutes(next.getMinutes() + duration);

      // 🚨 não ultrapassar expediente
      if (next > endDate) {
        break;
      }

      // 🚨 ignorar horários passados
      if (current < now) {
        current.setMinutes(current.getMinutes() + duration + buffer);
        continue;
      }

      const startTime = this.formatTime(current);
      const endTime = this.formatTime(next);

      const startMin = this.toMinutes(startTime);
      const endMin = this.toMinutes(endTime);

      const conflict = busySlots.some(
        (b) => startMin < b.end && endMin > b.start,
      );

      if (!conflict) {
        availableTimes.push(startTime);
      }

      current.setMinutes(current.getMinutes() + duration + buffer);
    }

    return {
      availableTimes,
    };
  }

  private toMinutes(time: string): number {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
  }

  private formatTime(date: Date): string {
    return date.toTimeString().slice(0, 5);
  }
}

export namespace ListAvailableTimesUseCase {
  export type Input = {
    barberId: string;
    serviceId: string;
    barbershopId: string;
    date: string;
  };

  export type Output = {
    availableTimes: string[];
  };
}
