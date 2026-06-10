import { CrmContact, CrmDeal, CrmTask, CrmEvent, Customer } from '@/generated/prisma';

export interface CrmContactWithRelations extends CrmContact {
  deals: CrmDeal[];
  tasks: CrmTask[];
  events: CrmEvent[];
}

export interface CrmDealWithRelations extends CrmDeal {
  contact: CrmContact;
}

export interface CrmTaskWithRelations extends CrmTask {
  contact: CrmContact | null;
}

export interface CrmEventWithRelations extends CrmEvent {
  contact: CrmContact | null;
}

export interface CustomerWithOrders extends Customer {
  orders: {
    id: string;
    orderNumber: string;
    totalAmount: number;
    createdAt: Date;
  }[];
}
