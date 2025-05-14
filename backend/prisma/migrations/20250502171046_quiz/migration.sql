-- AlterTable
ALTER TABLE `content` ADD COLUMN `quiz_id` INTEGER UNSIGNED NULL,
    MODIFY `type` ENUM('IMAGE', 'PDF', 'VIDEO', 'PPTX', 'QUIZ', 'OTHER') NOT NULL;

-- AddForeignKey
ALTER TABLE `Content` ADD CONSTRAINT `Content_quiz_id_fkey` FOREIGN KEY (`quiz_id`) REFERENCES `Quiz`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
