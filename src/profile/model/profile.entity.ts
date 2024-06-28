import {
  Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn, UpdateDateColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { Resource } from '../../resource/model/resource.entity';

@Entity()
export class Profile {
  /**
   * Profile ID.
   */
  @PrimaryColumn('uuid')
    id!: string;

  /**
   * Creation date of the profile.
   */
  @CreateDateColumn()
    created?: Date;

  /**
   * Update date of the profile.
   */
  @UpdateDateColumn()
    updated?: Date;

  /**
   * Name of the profile.
   */
  @Column()
    name!: string;

  /**
   * Role of the profile.
   */
  @Column()
    role!: string;

  /**
   * Email address of the profile.
   */
  @Column({
    unique: true,
  })
    emailAddress!: string;

  /**
   * Company name of the profile.
   */
  @Column()
    companyName!: string;

  // relationship columns
  @OneToMany(
    () => Resource,
    (resource: Resource) => resource.profile,
  )
    resources?: Resource[];

  /**
     * Constructor.
     * @param profile Profile.
     */
  constructor(
    profile: Profile,
  ) {
    Object.assign(this, profile);
  }
}
