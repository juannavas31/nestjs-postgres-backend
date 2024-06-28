import {
  BeforeInsert, Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn, UpdateDateColumn,
} from 'typeorm';
import { Profile } from '../../profile/model/profile.entity';

  @Entity()
export class Resource {
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
     * Name of the resource.
     */
    @Column()
      name!: string;

    /**
     * blockchain address of the resource.
     */
    @Column({
      unique: true,
    })
      address!: string;

    // relationship columns

    /**
     * Profile of the resource. Owner
     */
    @ManyToOne(
      () => Profile,
      (profile: Profile) => profile.resources,
    )
      profile?: Profile;

    /**
       * Constructor.
       * @param resource Resource.
       */
    constructor(
      resource: Resource,
    ) {
      Object.assign(this, resource);
    }
}
