import { ITransactionManager } from "Application/shared/ITransactionManager";
import { Book } from "Domain/models/Book/Book";
import { BookId } from "Domain/models/Book/BookId/BookId";
import { IBookRepository } from "Domain/models/Book/IBookRepository";
import { ISBNDuplicationCheckDomainService } from "Domain/service/Book/ISBNDuplicationCheckDomainService";
import { Title } from "Domain/models/Book/Title/Title";
import { Price } from "Domain/models/Book/Price/Price";

export type RegisterBookCommand = {
  isbn: string;
  title: string;
  priceAmount: number;
};

export class RegisterBookApplicatoinService {
  constructor(
    private bookRepository: IBookRepository,
    private transactionManager: ITransactionManager
  ) { }

  async execute(command: RegisterBookCommand): Promise<void> {
    await this.transactionManager.begin(async () => {
      const isDuplicateISBN = await new ISBNDuplicationCheckDomainService(
        this.bookRepository
      ).execute(new BookId(command.isbn));

      if (isDuplicateISBN) {
        throw new Error('既に存在する書籍です');
      }

      const book = Book.create(
        new BookId(command.isbn),
        new Title(command.title),
        new Price({ amount: command.priceAmount, currency: 'JPY' })
      );

      await this.bookRepository.save(book);
    });
  }
}
