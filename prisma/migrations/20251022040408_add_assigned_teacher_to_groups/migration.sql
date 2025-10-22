-- AlterTable
ALTER TABLE "Group" ADD COLUMN     "assigned_teacher_id" TEXT;

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_assigned_teacher_id_fkey" FOREIGN KEY ("assigned_teacher_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
