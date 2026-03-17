using Microsoft.EntityFrameworkCore;

namespace DAL.Conventions
{
    internal static class SnakeCaseConvention
    {
        internal static ModelBuilder UseSnakeCaseNaming(this ModelBuilder modelBuilder)
        {
            foreach (var entity in modelBuilder.Model.GetEntityTypes())
            {
                // TABLE
                entity.SetTableName(entity.GetTableName().ToSnakeCase());

                // COLUMNS
                foreach (var property in entity.GetProperties())
                    property.SetColumnName(property.GetColumnName().ToSnakeCase());

                // KEYS
                foreach (var key in entity.GetKeys())
                    key.SetName(key.GetName().ToSnakeCase());

                // FOREIGN KEYS
                foreach (var fk in entity.GetForeignKeys())
                    fk.SetConstraintName(fk.GetConstraintName().ToSnakeCase());

                // INDEXES
                foreach (var index in entity.GetIndexes())
                    index.SetDatabaseName(index.GetDatabaseName().ToSnakeCase());
            }

            return modelBuilder;
        }

        private static string? ToSnakeCase(this string? name)
        {
            if (string.IsNullOrWhiteSpace(name))
                return name;

            var sb = new System.Text.StringBuilder(name.Length + 10);

            for (int i = 0; i < name.Length; i++)
            {
                var c = name[i];

                if (char.IsUpper(c))
                {
                    if (i > 0)
                        sb.Append('_');

                    sb.Append(char.ToLowerInvariant(c));
                }
                else
                {
                    sb.Append(c);
                }
            }

            return sb.ToString();
        }
    }
}
