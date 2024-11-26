import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class PatientService {
  constructor(private prisma: PrismaService) {}

  async createOrUpdatePatientVisit(data: {
    patientId: string;
    visit: {
      visitDate: string;
      doctorId: string;
      diagnosis: string;
      treatment: string;
      notes: string;
    };
  }) {
    return this.prisma.$transaction(async (prisma) => {
      // Método upsert: si no existe crea, si existe agrega la visita
      return prisma.patient.upsert({
        where: { patientId: data.patientId },
        update: {
          visits: {
            create: {
              visitDate: new Date(data.visit.visitDate),
              doctorId: data.visit.doctorId,
              diagnosis: data.visit.diagnosis,
              treatment: data.visit.treatment,
              notes: data.visit.notes,
            },
          },
        },
        create: {
          patientId: data.patientId,
          visits: {
            create: {
              visitDate: new Date(data.visit.visitDate),
              doctorId: data.visit.doctorId,
              diagnosis: data.visit.diagnosis,
              treatment: data.visit.treatment,
              notes: data.visit.notes,
            },
          },
        },
        include: {
          visits: true,
        },
      });
    });
  }
}
