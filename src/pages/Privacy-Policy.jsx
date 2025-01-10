import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import LandingLayout from "@/layouts/Landing-Layout";

const POLICY_VALUES = {
  our: "Our Policy",
  meta: "Meta Policy",
  terms: "Terms and Conditions",
};

const PrivacyPolicy = () => {
  const { tab } = useParams();

  const [activeTab, setActiveTab] = useState(
    POLICY_VALUES[tab] || "Our Policy"
  );

  const tabs = [
    { name: "Our Policy", content: <OurPrivacyPolicy /> },
    { name: "Terms and Conditions", content: <TermsConditions /> },
  ];

  const getBackLink = () => {
    return "/";
  };

  return (
    <LandingLayout>
      <div className="no-scrollbar container mx-auto h-screen overflow-y-scroll px-4 py-16">
        <div className="mb-8">
          <Link
            to={getBackLink()}
            className="flex items-center text-black transition-colors duration-200 hover:text-primary-text"
          >
            <Icon icon="mingcute:home-2-line" className="mb-1 mr-2 h-4 w-4" />
            Back to{" "}
            {getBackLink() === "/login"
              ? "Login"
              : getBackLink() === "/register"
                ? "Register"
                : "Home"}
          </Link>
        </div>

        <h1 className="text-gray-800 dark:text-gray-100 mb-8 text-4xl font-bold">
          Terms and Policies
        </h1>
        <div className="mb-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="space-x-4">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.name}
                  value={tab.name}
                  className={`px-4 py-2 text-lg font-medium ${
                    activeTab === tab.name
                      ? "text-primary-text"
                      : "text-gray-600 dark:text-gray-300"
                  }`}
                >
                  {tab.name}
                </TabsTrigger>
              ))}
            </TabsList>
            {tabs.map((tab) => (
              <TabsContent
                key={tab.name}
                value={tab.name}
                className="prose dark:prose-dark"
              >
                {tab.content}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </LandingLayout>
  );
};

const OurPrivacyPolicy = () => (
  <div>
    <p className="text-gray-600 dark:text-gray-300 mb-4 text-lg">
      This Privacy Notice (“Notice”) sets out the basis which A2K Group
      Corporation (“we”, “us”, or “our”) may collect, use, disclose or otherwise
      process personal data of our customers in accordance with the Personal
      Data Protection Act (“PDPA”). This Notice applies to personal data in our
      possession or under our control, including personal data in the possession
      of organizations which we have engaged to collect, use, disclose or
      process personal data for our purposes.
    </p>

    <h2 className="text-gray-800 dark:text-gray-100 mb-4 mt-8 text-2xl font-semibold">
      Personal Data
    </h2>
    <p className="text-gray-600 dark:text-gray-300 mb-4 text-lg">
      As used in this Notice:
    </p>
    <p className="text-gray-600 dark:text-gray-300 mb-4 text-lg">
      <b>“customer”</b> means an individual who (a) has contacted us through any
      means to find out more about any goods or services we provide, or (b) may,
      or has, entered into a contract with us for the supply of any goods or
      services by us; and
    </p>
    <p className="text-gray-600 dark:text-gray-300 mb-4 text-lg">
      <b>“personal data”</b> means data, whether true or not, about a customer
      who can be identified: (a) from that data; or (b) from that data and other
      information to which we have or are likely to have access.
    </p>
    <p className="text-gray-600 dark:text-gray-300 mb-4 text-lg">
      Depending on the nature of your interaction with us, some examples of
      personal data which we may collect from you include name, email address,
      telephone number and payment details.
    </p>
    <p className="text-gray-600 dark:text-gray-300 mb-4 text-lg">
      Other terms used in this Notice shall have the meanings given to them in
      the PDPA (where the context so permits).
    </p>

    <h2 className="text-gray-800 dark:text-gray-100 mb-4 mt-8 text-2xl font-semibold">
      Collection, Use and Disclosure of Personal Data
    </h2>
    <p className="text-gray-600 dark:text-gray-300 mb-4 text-lg">
      We generally do not collect your personal data unless (a) it is provided
      to us voluntarily by you directly or via a third party who has been duly
      authorized by you to disclose your personal data to us (your “authorized
      representative”) after (i) you (or your authorized representative) have
      been notified of the purposes for which the data is collected, and (ii)
      you (or your authorized representative) have provided written consent to
      the collection and usage of your personal data for those purposes, or (b)
      collection and use of personal data without consent is permitted or
      required by the PDPA or other laws. We shall seek your consent before
      collecting any additional personal data and before using your personal
      data for a purpose which has not been notified to you (except where
      permitted or authorized by law).
    </p>
    <p className="text-gray-600 dark:text-gray-300 mb-4 text-lg">
      We may collect and use your personal data for any or all of the following
      purposes:
    </p>
    <ul className="text-gray-600 dark:text-gray-300 mb-4 list-inside list-disc text-lg">
      <li>
        Performing obligations in the course of or in connection with our
        provision of the goods and/or services requested by you;
      </li>
      <li>Verifying your identity;</li>
      <li>
        Responding to, handling, and processing queries, requests, applications,
        complaints, and feedback from you;
      </li>
      <li>Managing your relationship with us;</li>
      <li>
        Complying with any applicable laws, regulations, codes of practice,
        guidelines, or rules, or to assist in law enforcement and investigations
        conducted by any governmental and/or regulatory authority;
      </li>
      <li>Any other purposes for which you have provided the information;</li>
      <li>
        Transmitting to any unaffiliated third parties including our third-party
        service providers and agents, and relevant governmental and/or
        regulatory authorities for the aforementioned purposes; and
      </li>
      <li>
        Any other incidental business purposes related to or in connection with
        the above.
      </li>
    </ul>
    <p className="text-gray-600 dark:text-gray-300 mb-4 text-lg">
      We may disclose your personal data:
    </p>
    <ul className="text-gray-600 dark:text-gray-300 mb-4 list-inside list-disc text-lg">
      <li>
        Where such disclosure is required for performing obligations in the
        course of or in connection with our provision of the goods and services
        requested by you;
      </li>
      <li>
        To third party service providers, agents and other organizations we have
        engaged to perform any of the functions with reference to the above
        mentioned purposes; or
      </li>
      <li>With the express consent of the customer.</li>
    </ul>
    <p className="text-gray-600 dark:text-gray-300 mb-4 text-lg">
      The purposes listed in the above clauses may continue to apply even in
      situations where your relationship with us (for example, pursuant to a
      contract) has been terminated or altered in any way, for a reasonable
      period thereafter (including, where applicable, a period to enable us to
      enforce our rights under a contract with you).
    </p>

    <h2 className="text-gray-800 dark:text-gray-100 mb-4 mt-8 text-2xl font-semibold">
      Withdrawing Your Consent
    </h2>
    <p className="text-gray-600 dark:text-gray-300 mb-4 text-lg">
      The consent that you provide for the collection, use and disclosure of
      your personal data will remain valid until such time it is being withdrawn
      by you in writing. You may withdraw consent and request us to stop
      collecting, using and/or disclosing your personal data for any or all of
      the purposes listed above by submitting your request in writing or via
      email to our Data Protection Officer at the contact details provided
      below.
    </p>
    <p className="text-gray-600 dark:text-gray-300 mb-4 text-lg">
      Upon receipt of your written request to withdraw your consent, we may
      require reasonable time (depending on the complexity of the request and
      its impact on our relationship with you) for your request to be processed
      and for us to notify you of the consequences of us acceding to the same,
      including any legal consequences which may affect your rights and
      liabilities to us. In general, we shall seek to process your request
      within ten (10) business days of receiving it.
    </p>
    <p className="text-gray-600 dark:text-gray-300 mb-4 text-lg">
      Whilst we respect your decision to withdraw your consent, please note that
      depending on the nature and scope of your request, we may not be in a
      position to continue providing our goods or services to you and we shall,
      in such circumstances, notify you before completing the processing of your
      request. Should you decide to cancel your withdrawal of consent, please
      inform us in writing in the manner described in clause 8 above.
    </p>
    <p className="text-gray-600 dark:text-gray-300 mb-4 text-lg">
      Please note that withdrawing consent does not affect our right to continue
      to collect, use and disclose personal data where such collection, use and
      disclose without consent is permitted or required under applicable laws.
    </p>

    <h2 className="text-gray-800 dark:text-gray-100 mb-4 mt-8 text-2xl font-semibold">
      Access to and Correction of Personal Data
    </h2>
    <p className="text-gray-600 dark:text-gray-300 mb-4 text-lg">
      If you wish to make (a) an access request for access to a copy of the
      personal data which we hold about you or information about the ways in
      which we use or disclose your personal data, or (b) a correction request
      to correct or update any of your personal data which we hold about you,
      you may submit your request in writing or via email to our Data Protection
      Officer at the contact details provided below.
    </p>
    <p className="text-gray-600 dark:text-gray-300 mb-4 text-lg">
      Please note that a reasonable fee may be charged for an access request. If
      so, we will inform you of the fee before processing your request.
    </p>
    <p className="text-gray-600 dark:text-gray-300 mb-4 text-lg">
      We will respond to your request as soon as reasonably possible. In
      general, our response will be within ten (10) business days. Should we not
      be able to respond to your request within thirty (30) days after receiving
      your request, we will inform you in writing within thirty (30) days of the
      time by which we will be able to respond to your request. If we are unable
      to provide you with any personal data or to make a correction requested by
      you, we shall generally inform you of the reasons why we are unable to do
      so (except where we are not required to do so under the PDPA).
    </p>

    <h2 className="text-gray-800 dark:text-gray-100 mb-4 mt-8 text-2xl font-semibold">
      Protection of Personal Data
    </h2>
    <p className="text-gray-600 dark:text-gray-300 mb-4 text-lg">
      To safeguard your personal data from unauthorized access, collection, use,
      disclosure, copying, modification, disposal or similar risks, we have
      introduced appropriate administrative, physical and technical measures
      such as authentication and access controls (such as good password
      practices, need-to-basis for data disclosure, etc.), encryption of data,
      data anonymization, up-to-date antivirus protection, regular patching of
      operating system and other software, web security measures against risks,
      and security review and testing performed regularly.
    </p>
    <p className="text-gray-600 dark:text-gray-300 mb-4 text-lg">
      You should be aware, however, that no method of transmission over the
      Internet or method of electronic storage is completely secure. While
      security cannot be guaranteed, we strive to protect the security of your
      information and are constantly reviewing and enhancing our information
      security measures.
    </p>

    <h2 className="text-gray-800 dark:text-gray-100 mb-4 mt-8 text-2xl font-semibold">
      Accuracy of Personal Data
    </h2>
    <p className="text-gray-600 dark:text-gray-300 mb-4 text-lg">
      We generally rely on personal data provided by you (or your authorised
      representative). In order to ensure that your personal data is current,
      complete and accurate, please update us if there are changes to your
      personal data by informing our Data Protection Officer in writing or via
      email at the contact details provided below.
    </p>

    <h2 className="text-gray-800 dark:text-gray-100 mb-4 mt-8 text-2xl font-semibold">
      Retention of Personal Data
    </h2>
    <p className="text-gray-600 dark:text-gray-300 mb-4 text-lg">
      We may retain your personal data for as long as it is necessary to fulfil
      the purpose for which it was collected, or as required or permitted by
      applicable laws.
    </p>
    <p className="text-gray-600 dark:text-gray-300 mb-4 text-lg">
      We will cease to retain your personal data, or remove the means by which
      the data can be associated with you, as soon as it is reasonable to assume
      that such retention no longer serves the purpose for which the personal
      data was collected, and is no longer necessary for legal or business
      purposes.
    </p>

    <h2 className="text-gray-800 dark:text-gray-100 mb-4 mt-8 text-2xl font-semibold">
      Transfers of Personal Data Beyond Borders
    </h2>
    <p className="text-gray-600 dark:text-gray-300 mb-4 text-lg">
      In accordance with the relevant laws and regulations, we may transfer or
      disclose your personal data to parties in other countries. However, such
      transfer or disclosure will only occur if appropriate safeguards are in
      place to protect your privacy and ensure that the level of protection
      guaranteed for your personal data under the law and its regulations is not
      compromised. This means that the transfer or disclosure will not affect
      your ability to exercise your rights under the applicable laws and
      regulations, or the controller’s ability to comply with requirements for
      notifying personal data breaches, destroying and controlling your personal
      data, and disclosing personal data. We will also take necessary
      organizational, administrative, and technical measures to ensure the
      security of your personal data.
    </p>

    <h2 className="text-gray-800 dark:text-gray-100 mb-4 mt-8 text-2xl font-semibold">
      Data Protection Officer
    </h2>
    <p className="text-gray-600 dark:text-gray-300 mb-4 text-lg">
      You may contact our Data Protection Officer if you have any enquiries or
      feedback on our personal data protection policies and procedures, or if
      you wish to make any request, in the following manner:
    </p>
    <p className="text-gray-600 dark:text-gray-300 mb-4 text-lg">
      Name of DPO: Evelyn Layson
    </p>
    <p className="text-gray-600 dark:text-gray-300 mb-4 text-lg">
      Contact No.: +63 045 4050 296
    </p>
    <p className="text-gray-600 dark:text-gray-300 mb-4 text-lg">
      Email Address: admin@a2kgroup.org
    </p>
    <p className="text-gray-600 dark:text-gray-300 mb-4 text-lg">
      Address: Jose Abad Santos Avenue, Cabalantian, Bacolor, Pampanga,
      Philippines 2001
    </p>

    <h2 className="text-gray-800 dark:text-gray-100 mb-4 mt-8 text-2xl font-semibold">
      Effect of Notice and Changes to Notice
    </h2>
    <p className="text-gray-600 dark:text-gray-300 mb-4 text-lg">
      This Notice applies in conjunction with any other notices, contractual
      clauses and consent clauses that apply in relation to the collection, use
      and disclosure of your personal data by us.
    </p>
    <p className="text-gray-600 dark:text-gray-300 mb-4 text-lg">
      We may revise this Notice from time to time without any prior notice. You
      may determine if any such revision has taken place by referring to the
      date on which this Notice was last updated. Your continued use of our
      services constitutes your acknowledgement and acceptance of such changes.
    </p>
    <p className="text-gray-600 dark:text-gray-300 mb-4 text-lg">
      Effective date: 31/12/2024
    </p>
    <p className="text-gray-600 dark:text-gray-300 mb-4 text-lg">
      Last updated: 31/12/2024
    </p>
  </div>
);

const TermsConditions = () => (
  <div>
    <p className="text-gray-600 dark:text-gray-300 mb-4 text-lg">
      Last Updated: December 31, 2024
    </p>
    <h2 className="text-gray-800 dark:text-gray-100 mb-4 mt-8 text-2xl font-semibold">
      1. Acceptance of Terms
    </h2>
    <p className="text-gray-600 dark:text-gray-300 mb-4 text-lg">
      By accessing Portal at togatherinv1.vercel.app, you agree to abide by
      these Terms & Conditions. If you do not agree, please discontinue use of
      our services.
    </p>
    <h2 className="text-gray-800 dark:text-gray-100 mb-4 mt-8 text-2xl font-semibold">
      2. User Accounts
    </h2>
    <ul className="text-gray-600 dark:text-gray-300 mb-4 list-inside list-disc text-lg">
      <li>
        You are responsible for maintaining the confidentiality of your account
        credentials.
      </li>
      <li>
        You must provide accurate and updated information when registering.
      </li>
    </ul>
    <h2 className="text-gray-800 dark:text-gray-100 mb-4 mt-8 text-2xl font-semibold">
      3. Use of Services
    </h2>
    <ul className="text-gray-600 dark:text-gray-300 mb-4 list-inside list-disc text-lg">
      <li>You may use our services only for lawful purposes.</li>
      <li>
        You must not attempt to hack, reverse engineer, or disrupt our services.
      </li>
    </ul>
    <h2 className="text-gray-800 dark:text-gray-100 mb-4 mt-8 text-2xl font-semibold">
      4. User-Generated Content
    </h2>
    <ul className="text-gray-600 dark:text-gray-300 mb-4 list-inside list-disc text-lg">
      <li>You retain ownership of announcements you upload to our portal.</li>
      <li>
        By uploading announcements, you grant us a license to use them solely to
        provide our services.
      </li>
    </ul>
    <h2 className="text-gray-800 dark:text-gray-100 mb-4 mt-8 text-2xl font-semibold">
      5. Liability
    </h2>
    <ul className="text-gray-600 dark:text-gray-300 mb-4 list-inside list-disc text-lg">
      <li>
        We are not liable for indirect damages or loss resulting from service
        interruptions.
      </li>
      <li>
        Our maximum liability is limited to the amount paid for the service
        during the past 12 months.
      </li>
    </ul>
    <h2 className="text-gray-800 dark:text-gray-100 mb-4 mt-8 text-2xl font-semibold">
      6. Termination
    </h2>
    <p className="text-gray-600 dark:text-gray-300 mb-4 text-lg">
      We reserve the right to terminate or suspend your access to our services
      at any time, without notice, for conduct that we believe violates these
      Terms & Conditions or is harmful to other users of our services, us, or
      third parties, or for any other reason.
    </p>
    <h2 className="text-gray-800 dark:text-gray-100 mb-4 mt-8 text-2xl font-semibold">
      7. Changes to Terms
    </h2>
    <p className="text-gray-600 dark:text-gray-300 mb-4 text-lg">
      We may revise these Terms & Conditions from time to time. The most current
      version will always be posted on our website. By continuing to access or
      use our services after revisions become effective, you agree to be bound
      by the revised Terms & Conditions.
    </p>
    <h2 className="text-gray-800 dark:text-gray-100 mb-4 mt-8 text-2xl font-semibold">
      8. Governing Law
    </h2>
    <p className="text-gray-600 dark:text-gray-300 mb-4 text-lg">
      These Terms & Conditions are governed by and construed in accordance with
      the laws of the Philippines without regard to its conflict of law
      principles.
    </p>
    <h2 className="text-gray-800 dark:text-gray-100 mb-4 mt-8 text-2xl font-semibold">
      9. Contact Information
    </h2>
    <p className="text-gray-600 dark:text-gray-300 mb-4 text-lg">
      If you have any questions about these Terms & Conditions, please contact
      us at admin@a2kgroup.org.
    </p>
  </div>
);

export default PrivacyPolicy;
