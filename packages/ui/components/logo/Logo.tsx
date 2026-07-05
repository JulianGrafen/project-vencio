import { APP_NAME, LOGO_DARK } from "@calcom/lib/constants";
import classNames from "@calcom/ui/classNames";

const isTeethAlBrand = APP_NAME === "teeth.al";

export function Logo({
  small,
  icon,
  inline = true,
  className,
  src = "/api/logo",
}: {
  small?: boolean;
  icon?: boolean;
  inline?: boolean;
  className?: string;
  src?: string;
}) {
  const wordmarkSrc = isTeethAlBrand ? LOGO_DARK : src;

  return (
    <h3 className={classNames("logo", inline && "inline", className)}>
      <strong>
        {icon ? (
          <img
            className={classNames("mx-auto w-9", !isTeethAlBrand && "dark:invert")}
            alt={APP_NAME}
            title={APP_NAME}
            src={`${src}?type=icon`}
          />
        ) : (
          <>
            {isTeethAlBrand ? (
              <>
                <img
                  className={classNames(small ? "h-4 w-auto" : "h-5 w-auto", "dark:hidden")}
                  alt={APP_NAME}
                  title={APP_NAME}
                  src="/teeth-al-logo.svg"
                />
                <img
                  className={classNames(small ? "h-4 w-auto" : "h-5 w-auto", "hidden dark:block")}
                  alt={APP_NAME}
                  title={APP_NAME}
                  src={wordmarkSrc}
                />
              </>
            ) : (
              <img
                className={classNames(small ? "h-4 w-auto" : "h-5 w-auto", "dark:invert")}
                alt={APP_NAME}
                title={APP_NAME}
                src={src}
              />
            )}
          </>
        )}
      </strong>
    </h3>
  );
}
