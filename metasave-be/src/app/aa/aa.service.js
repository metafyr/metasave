import { Injectable } from '@nestjs/common';

@Injectable()
export class AAService {

  helloWorld() {
    return "lol";
  }
}