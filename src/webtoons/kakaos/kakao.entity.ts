import { ChildEntity } from 'typeorm';
import { Webtoon } from '../webtoon.entity';

@ChildEntity()
export class Kakao extends Webtoon {}
