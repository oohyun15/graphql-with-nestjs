import { ChildEntity } from 'typeorm';
import { Webtoon } from '../webtoon.entity';

@ChildEntity()
export class Naver extends Webtoon {}
