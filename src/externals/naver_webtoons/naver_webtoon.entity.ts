import { ChildEntity } from "typeorm";
import { External } from "../external.entity";

@ChildEntity()
export class NaverWebtoon extends External {
}