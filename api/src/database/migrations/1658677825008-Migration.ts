import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1658677825008 implements MigrationInterface {
    name = 'Migration1658677825008'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `genres` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(45) NOT NULL, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `tags` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(30) NOT NULL, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `channels_tags` (`id` int NOT NULL AUTO_INCREMENT, `tag_id` int NOT NULL, `channel_id` int NOT NULL, `genre_id` int NOT NULL, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `users` (`id` int NOT NULL AUTO_INCREMENT, `username` varchar(20) NOT NULL, `email` varchar(45) NOT NULL, `password` varchar(100) NOT NULL, `certification` tinyint NOT NULL DEFAULT 0, `self_introduction` varchar(255) NULL, `profileImage` varchar(255) NULL, `key` varchar(255) NULL, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `users_channels` (`id` int NOT NULL AUTO_INCREMENT, `user_id` int NOT NULL, `channel_id` int NOT NULL, `genre_id` int NOT NULL, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `channels` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(45) NOT NULL, `explanation` varchar(255) NULL, `genre_id` int NOT NULL, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `sub_comments` (`id` int NOT NULL AUTO_INCREMENT, `comment` text NOT NULL, `user_id` int NOT NULL, `master_comment_id` tinyint NOT NULL, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `channel_id` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `likes` (`id` int NOT NULL AUTO_INCREMENT, `master_comment_id` int NOT NULL, `sub_comment_id` int NULL, `user_id` int NOT NULL, `channel_id` int NOT NULL, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `master_comments` (`id` int NOT NULL AUTO_INCREMENT, `comment` text NOT NULL, `picture` varchar(255) NULL, `key` varchar(255) NULL, `user_id` int NOT NULL, `channel_id` int NOT NULL, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `bookmarks` (`id` int NOT NULL AUTO_INCREMENT, `master_comment_id` int NULL, `thread_comment_id` int NULL, `user_id` int NOT NULL, `genre_id` int NOT NULL, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `favorites` (`id` int NOT NULL AUTO_INCREMENT, `channel_id` int NOT NULL, `user_id` int NOT NULL, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `users_genres` (`id` int NOT NULL AUTO_INCREMENT, `user_id` int NOT NULL, `genre_id` int NOT NULL, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `channels_tags` ADD CONSTRAINT `FK_5c45a5c5e848bbb6c45a119a52b` FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `channels_tags` ADD CONSTRAINT `FK_a0c6aa9e737919eb7f35236ed5e` FOREIGN KEY (`channel_id`) REFERENCES `channels`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `channels_tags` ADD CONSTRAINT `FK_75b62d2a753cd51028dadecd9d6` FOREIGN KEY (`genre_id`) REFERENCES `genres`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `users_channels` ADD CONSTRAINT `FK_c56ac2caba1ccf5dca60e33d35a` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `users_channels` ADD CONSTRAINT `FK_c71789b307469dbb27644754522` FOREIGN KEY (`channel_id`) REFERENCES `channels`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `users_channels` ADD CONSTRAINT `FK_42e2a675c104b7a5c858cee309d` FOREIGN KEY (`genre_id`) REFERENCES `genres`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `channels` ADD CONSTRAINT `FK_6eb78dae112d0457e00f80f3d5e` FOREIGN KEY (`genre_id`) REFERENCES `genres`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `sub_comments` ADD CONSTRAINT `FK_4f924f15dc4670a150492d6d468` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `sub_comments` ADD CONSTRAINT `FK_fe6b4a64bc6d846a59540e824f5` FOREIGN KEY (`channel_id`) REFERENCES `master_comments`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `likes` ADD CONSTRAINT `FK_3528372126013ad68c3e7b81a1f` FOREIGN KEY (`master_comment_id`) REFERENCES `master_comments`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `likes` ADD CONSTRAINT `FK_3f0e7c2a84e6b5ef4f85dcc3726` FOREIGN KEY (`sub_comment_id`) REFERENCES `sub_comments`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `likes` ADD CONSTRAINT `FK_3f519ed95f775c781a254089171` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `likes` ADD CONSTRAINT `FK_6089799fff50a6007eb1c8d9c96` FOREIGN KEY (`channel_id`) REFERENCES `channels`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `master_comments` ADD CONSTRAINT `FK_2b15142474d79d319c3a16ec387` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `master_comments` ADD CONSTRAINT `FK_0679d19bd8f32f849d3341b8bed` FOREIGN KEY (`channel_id`) REFERENCES `channels`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `bookmarks` ADD CONSTRAINT `FK_53414191ebe3fd7ebeb8ad0076b` FOREIGN KEY (`master_comment_id`) REFERENCES `master_comments`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `bookmarks` ADD CONSTRAINT `FK_265cfa8ed0c8ae267e17ba1e434` FOREIGN KEY (`thread_comment_id`) REFERENCES `sub_comments`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `bookmarks` ADD CONSTRAINT `FK_58a0fbaee65cd8959a870ee678c` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `bookmarks` ADD CONSTRAINT `FK_879f11526c46401d5eefd71d6e6` FOREIGN KEY (`genre_id`) REFERENCES `genres`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `favorites` ADD CONSTRAINT `FK_933bc7d0ddce2df28e6cfc83415` FOREIGN KEY (`channel_id`) REFERENCES `channels`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `favorites` ADD CONSTRAINT `FK_35a6b05ee3b624d0de01ee50593` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `users_genres` ADD CONSTRAINT `FK_55e0805fdaf6f9725d062662b11` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `users_genres` ADD CONSTRAINT `FK_4f7ec573c98496db516a703fdbd` FOREIGN KEY (`genre_id`) REFERENCES `genres`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `users_genres` DROP FOREIGN KEY `FK_4f7ec573c98496db516a703fdbd`");
        await queryRunner.query("ALTER TABLE `users_genres` DROP FOREIGN KEY `FK_55e0805fdaf6f9725d062662b11`");
        await queryRunner.query("ALTER TABLE `favorites` DROP FOREIGN KEY `FK_35a6b05ee3b624d0de01ee50593`");
        await queryRunner.query("ALTER TABLE `favorites` DROP FOREIGN KEY `FK_933bc7d0ddce2df28e6cfc83415`");
        await queryRunner.query("ALTER TABLE `bookmarks` DROP FOREIGN KEY `FK_879f11526c46401d5eefd71d6e6`");
        await queryRunner.query("ALTER TABLE `bookmarks` DROP FOREIGN KEY `FK_58a0fbaee65cd8959a870ee678c`");
        await queryRunner.query("ALTER TABLE `bookmarks` DROP FOREIGN KEY `FK_265cfa8ed0c8ae267e17ba1e434`");
        await queryRunner.query("ALTER TABLE `bookmarks` DROP FOREIGN KEY `FK_53414191ebe3fd7ebeb8ad0076b`");
        await queryRunner.query("ALTER TABLE `master_comments` DROP FOREIGN KEY `FK_0679d19bd8f32f849d3341b8bed`");
        await queryRunner.query("ALTER TABLE `master_comments` DROP FOREIGN KEY `FK_2b15142474d79d319c3a16ec387`");
        await queryRunner.query("ALTER TABLE `likes` DROP FOREIGN KEY `FK_6089799fff50a6007eb1c8d9c96`");
        await queryRunner.query("ALTER TABLE `likes` DROP FOREIGN KEY `FK_3f519ed95f775c781a254089171`");
        await queryRunner.query("ALTER TABLE `likes` DROP FOREIGN KEY `FK_3f0e7c2a84e6b5ef4f85dcc3726`");
        await queryRunner.query("ALTER TABLE `likes` DROP FOREIGN KEY `FK_3528372126013ad68c3e7b81a1f`");
        await queryRunner.query("ALTER TABLE `sub_comments` DROP FOREIGN KEY `FK_fe6b4a64bc6d846a59540e824f5`");
        await queryRunner.query("ALTER TABLE `sub_comments` DROP FOREIGN KEY `FK_4f924f15dc4670a150492d6d468`");
        await queryRunner.query("ALTER TABLE `channels` DROP FOREIGN KEY `FK_6eb78dae112d0457e00f80f3d5e`");
        await queryRunner.query("ALTER TABLE `users_channels` DROP FOREIGN KEY `FK_42e2a675c104b7a5c858cee309d`");
        await queryRunner.query("ALTER TABLE `users_channels` DROP FOREIGN KEY `FK_c71789b307469dbb27644754522`");
        await queryRunner.query("ALTER TABLE `users_channels` DROP FOREIGN KEY `FK_c56ac2caba1ccf5dca60e33d35a`");
        await queryRunner.query("ALTER TABLE `channels_tags` DROP FOREIGN KEY `FK_75b62d2a753cd51028dadecd9d6`");
        await queryRunner.query("ALTER TABLE `channels_tags` DROP FOREIGN KEY `FK_a0c6aa9e737919eb7f35236ed5e`");
        await queryRunner.query("ALTER TABLE `channels_tags` DROP FOREIGN KEY `FK_5c45a5c5e848bbb6c45a119a52b`");
        await queryRunner.query("DROP TABLE `users_genres`");
        await queryRunner.query("DROP TABLE `favorites`");
        await queryRunner.query("DROP TABLE `bookmarks`");
        await queryRunner.query("DROP TABLE `master_comments`");
        await queryRunner.query("DROP TABLE `likes`");
        await queryRunner.query("DROP TABLE `sub_comments`");
        await queryRunner.query("DROP TABLE `channels`");
        await queryRunner.query("DROP TABLE `users_channels`");
        await queryRunner.query("DROP TABLE `users`");
        await queryRunner.query("DROP TABLE `channels_tags`");
        await queryRunner.query("DROP TABLE `tags`");
        await queryRunner.query("DROP TABLE `genres`");
    }

}
