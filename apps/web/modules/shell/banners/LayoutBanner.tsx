import AdminPasswordBanner, {
  type AdminPasswordBannerProps,
} from "@calcom/web/modules/users/components/AdminPasswordBanner";
import CalendarCredentialBanner, {
  type CalendarCredentialBannerProps,
} from "@calcom/web/modules/users/components/CalendarCredentialBanner";
import {
  InvalidAppCredentialBanners,
  type InvalidAppCredentialBannersProps,
} from "@calcom/web/modules/users/components/InvalidAppCredentialsBanner";
import VerifyEmailBanner, {
  type VerifyEmailBannerProps,
} from "@calcom/web/modules/users/components/VerifyEmailBanner";
import { DentalTwoFactorBanner } from "@calcom/web/modules/settings/security/DentalTwoFactorBanner";
import {
  PracticeTrialBanner,
  type PracticeTrialBannerData,
} from "@calcom/web/modules/trial/PracticeTrialBanner";

type BannerTypeProps = {
  verifyEmailBanner: VerifyEmailBannerProps;
  adminPasswordBanner: AdminPasswordBannerProps;
  dentalTwoFactorBanner: { data: boolean | null };
  practiceTrialBanner: { data: PracticeTrialBannerData | null };
  calendarCredentialBanner: CalendarCredentialBannerProps;
  invalidAppCredentialBanners: InvalidAppCredentialBannersProps;
};

type BannerType = keyof BannerTypeProps;

type BannerComponent = {
  [Key in BannerType]: (props: BannerTypeProps[Key]) => JSX.Element | null;
};

export type AllBannerProps = { [Key in BannerType]: BannerTypeProps[Key]["data"] };

export const BannerComponent: BannerComponent = {
  verifyEmailBanner: (props: VerifyEmailBannerProps) => <VerifyEmailBanner {...props} />,
  adminPasswordBanner: (props: AdminPasswordBannerProps) => <AdminPasswordBanner {...props} />,
  dentalTwoFactorBanner: (_props: { data: boolean | null }) => <DentalTwoFactorBanner />,
  practiceTrialBanner: (props: { data: PracticeTrialBannerData | null }) =>
    props.data ? <PracticeTrialBanner data={props.data} /> : null,
  calendarCredentialBanner: (props: CalendarCredentialBannerProps) => <CalendarCredentialBanner {...props} />,
  invalidAppCredentialBanners: (props: InvalidAppCredentialBannersProps) => (
    <InvalidAppCredentialBanners {...props} />
  ),
};

interface BannerContainerProps {
  banners: AllBannerProps;
}

export const BannerContainer: React.FC<BannerContainerProps> = ({ banners }) => {
  return (
    <div className="sticky top-0 z-10 w-full divide-y divide-black">
      {Object.keys(banners).map((key) => {
        if (key === "verifyEmailBanner") {
          const Banner = BannerComponent[key];
          return <Banner data={banners[key]} key={key} />;
        } else if (key === "adminPasswordBanner") {
          const Banner = BannerComponent[key];
          return <Banner data={banners[key]} key={key} />;
        } else if (key === "dentalTwoFactorBanner") {
          if (!banners[key]) return null;
          const Banner = BannerComponent[key];
          return <Banner data={banners[key]} key={key} />;
        } else if (key === "practiceTrialBanner") {
          if (!banners[key]) return null;
          const Banner = BannerComponent[key];
          return <Banner data={banners[key]} key={key} />;
        } else if (key === "calendarCredentialBanner") {
          const Banner = BannerComponent[key];
          return <Banner data={banners[key]} key={key} />;
        } else if (key === "invalidAppCredentialBanners") {
          const Banner = BannerComponent[key];
          return <Banner data={banners[key]} key={key} />;
        }
      })}
    </div>
  );
};
