import { Injectable } from '@angular/core';

export interface PaymentDetails {
  name: string;
  cardNumber: string;
  cvv: string;
  expiryMonth: number;
  expiryYear: number;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentMockService {
  private samplePayments: PaymentDetails[] = [
    {
      name: 'John Smith',
      cardNumber: '1234567890123456',
      cvv: '123',
      expiryMonth: 12,
      expiryYear: 2025
    },
    {
      name: 'Jane Doe',
      cardNumber: '9876543210987654',
      cvv: '456',
      expiryMonth: 6,
      expiryYear: 2026
    },
    {
      name: 'Piyush Pawar',
      cardNumber: '1903200249124912',
      cvv: '789',
      expiryMonth: 3,
      expiryYear: 2027
    },
    {
      name: 'Sarah Wilson',
      cardNumber: '5555666677778888',
      cvv: '321',
      expiryMonth: 9,
      expiryYear: 2028
    },
    {
      name: 'David Brown',
      cardNumber: '9999000011112222',
      cvv: '654',
      expiryMonth: 1,
      expiryYear: 2029
    },
    {
      name: 'Emily Davis',
      cardNumber: '3333444455556666',
      cvv: '987',
      expiryMonth: 7,
      expiryYear: 2030
    },
    {
      name: 'Robert Miller',
      cardNumber: '7777888899990000',
      cvv: '147',
      expiryMonth: 11,
      expiryYear: 2031
    },
    {
      name: 'Lisa Anderson',
      cardNumber: '2222333344445555',
      cvv: '258',
      expiryMonth: 4,
      expiryYear: 2032
    },
    {
      name: 'James Taylor',
      cardNumber: '6666777788889999',
      cvv: '369',
      expiryMonth: 8,
      expiryYear: 2033
    },
    {
      name: 'Amanda White',
      cardNumber: '0000111122223333',
      cvv: '741',
      expiryMonth: 2,
      expiryYear: 2034
    },
    {
      name: 'Christopher Lee',
      cardNumber: '4444555566667777',
      cvv: '852',
      expiryMonth: 5,
      expiryYear: 2035
    },
    {
      name: 'Jessica Garcia',
      cardNumber: '8888999900001111',
      cvv: '963',
      expiryMonth: 10,
      expiryYear: 2035
    }
  ];

  constructor() {}

  validatePayment(details: PaymentDetails): boolean {
    return this.samplePayments.some(payment => {
      // Convert form values to proper types for comparison
      const formExpiryMonth = typeof details.expiryMonth === 'string' ? parseInt(details.expiryMonth) : details.expiryMonth;
      const formExpiryYear = typeof details.expiryYear === 'string' ? parseInt(details.expiryYear) : details.expiryYear;
      
      return payment.name.toLowerCase() === details.name.toLowerCase() &&
             payment.cardNumber === details.cardNumber &&
             payment.cvv === details.cvv &&
             payment.expiryMonth === formExpiryMonth &&
             payment.expiryYear === formExpiryYear;
    });
  }

  getSamplePayments(): PaymentDetails[] {
    return [...this.samplePayments];
  }
} 