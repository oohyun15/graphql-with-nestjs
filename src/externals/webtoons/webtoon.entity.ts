import { ChildEntity } from 'typeorm';
import { External } from '../external.entity';

@ChildEntity()
export class Webtoon extends External {}
