import { Scheduling } from "@/application/entites/Scheduling";
import { BarberRepository } from "@/infra/database/dynamo/repositories/BarberRepository";
import { BarbershopRepository } from "@/infra/database/dynamo/repositories/BarbershopRepository";
import { SchedulingRepository } from "@/infra/database/dynamo/repositories/SchedulingRepository";
import { ServiceRepository } from "@/infra/database/dynamo/repositories/ServiceRepository";
import { Injectable } from "@/kernel/decorators/Injectable";
@Injectable()
export class CreateSchedulingUseCase {
  constructor(
    private readonly schedulingRepository: SchedulingRepository,
    private readonly serviceRepository: ServiceRepository,
    private readonly barberRepository: BarberRepository,
    private readonly barbershopRepository: BarbershopRepository,
  ) {}

  async execute({
    barberId,
    barbershopId,
    date,
    serviceId,
    startTime,
    accountId,
  }: CreateSchedulingUseCase.Input): Promise<CreateSchedulingUseCase.Output> {
    const service = await this.serviceRepository.findById(barberId, serviceId);

    if (!service) {
      throw new Error("Service not found");
    }

    const barber = await this.barberRepository.findById(barbershopId, barberId);

    if (!barber) {
      throw new Error("Barber not found");
    }

    const barbershop = await this.barbershopRepository.findById(barbershopId);
    if (!barbershop) {
      throw new Error("Barbershop not found");
    }

    const [year, month, day] = date.split("-").map(Number);
    const dayOfWeek = new Date(year, month - 1, day).getDay();

    const workingDay = barber.workingHours.find(
      (d) => d.dayOfWeek === dayOfWeek,
    );

    if (!workingDay) {
      throw new Error("Barber does not work on this day");
    }

    const startDate = new Date(
      year,
      month - 1,
      day,
      ...startTime.split(":").map(Number),
    );

    const endDate = new Date(startDate);
    endDate.setMinutes(endDate.getMinutes() + service.duration);

    const endTime = this.formatTime(endDate);

    const endWorking = new Date(
      year,
      month - 1,
      day,
      ...workingDay.end.split(":").map(Number),
    );

    if (endDate > endWorking) {
      throw new Error("Service exceeds working hours");
    }

    const scheduling = new Scheduling({
      accountId,
      barbershop: {
        address: barbershop.address,
        id: barbershop.id,
        name: barbershop.name,
        phone: barbershop.phone,
        photoURL: barbershop.photoURL,
      },
      barber: {
        id: barber.id,
        name: barber.name,
        photoURL: barber.photoURL,
      },
      service: {
        duration: service.duration,
        name: service.name,
        price: service.price,
      },
      date,
      startTime,
      endTime,
      status: "SCHEDULED",
    });

    try {
      await this.schedulingRepository.create(scheduling);
    } catch {
      throw new Error("Time slot already booked");
    }

    return {
      schedulingId: scheduling.id,
    };
  }

  private formatTime(date: Date): string {
    return date.toTimeString().slice(0, 5);
  }
}

export namespace CreateSchedulingUseCase {
  export type Input = {
    accountId: string;
    barberId: string;
    serviceId: string;
    barbershopId: string;
    date: string;
    startTime: string;
    status?: Status;
  };

  export type Output = {
    schedulingId: string;
  };

  export type Status =
    | "SCHEDULED"
    | "CONFIRMED"
    | "CANCELLED"
    | "COMPLETED"
    | "NO_SHOW";
}
