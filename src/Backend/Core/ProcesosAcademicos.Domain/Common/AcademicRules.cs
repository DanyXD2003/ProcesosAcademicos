namespace ProcesosAcademicos.Domain.Common;

public static class AcademicRules
{
    public const decimal PassingGrade = 61m;

    public static bool IsApproved(decimal grade) => grade >= PassingGrade;
}
