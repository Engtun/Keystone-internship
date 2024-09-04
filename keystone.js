let securityLevel ;
const elementInstructions = {
  iot: [
    "Inventory and Risk Assessment: Create a complete inventory of all IoT devices connected to your network. Identify their purpose, functionality, and potential security risks.",
    "Patch Management: Ensure all IoT devices have the latest firmware updates installed. Outdated firmware can contain vulnerabilities that attackers exploit. Automate patching processes if possible to streamline updates.",
    "Strong Passwords and Authentication: Don't use default passwords on your IoT devices. Set strong, unique passwords and enable multi-factor authentication wherever available.",
    "Network Segmentation: Isolate IoT devices from your main corporate network. This can limit the damage if an IoT device gets compromised and prevent lateral movement within the network.",
    "Minimize External Access: Only allow authorized devices and applications to communicate with your IoT devices. Disable unnecessary features and services that could be exploited for attacks.",
    "Endpoint Security Solutions: Consider implementing endpoint security solutions specifically designed for IoT devices. These solutions can monitor device activity, detect suspicious behavior, and isolate infected devices.",
    "Continuous Monitoring: Continuously monitor your network for suspicious activity related to IoT devices. Look for unusual data transfers, unauthorized access attempts, or changes in device behavior.",
    "Intrusion Detection Systems (IDS): Deploy intrusion detection systems that can identify and alert you to potential ransomware attacks targeting your IoT devices.",
    "Security Information and Event Management (SIEM): A SIEM system can collect and analyze logs from various security tools, providing a centralized view of security events across your network, including those related to IoT devices.",
    "Physical Security: Implement physical security measures to prevent unauthorized access to IoT devices, especially those in critical areas.",
    "Vendor Selection: When choosing new IoT devices, consider the vendor's security track record and the availability of security updates for their products.",
    "End-of-Life (EOL) Management: Have a plan for phasing out outdated IoT devices that no longer receive security updates."
  ],
  firmware: [
    "Create a comprehensive list of all devices within your company's network, including routers, printers, IoT devices, and any other equipment with firmware.",
    "Regularly check for firmware updates from the device manufacturers. Many vendors offer automated notification systems for new firmware releases.",
    "Classify devices based on criticality. Prioritize updates for devices with access to sensitive data or those playing a vital role in core operations.",
    "Develop a risk assessment strategy to determine the urgency of updates based on potential impact and exploit likelihood.",
    "Download firmware updates only from official vendor websites.",
    "Implement a designated update server within your network to ensure updates are coming from a trusted source and can be scanned for malware before deployment.",
    "Consider automated firmware update tools for standardized devices. These tools can streamline the update process and reduce the risk of human error.",
    "Implement Firmware Signing and Verification.",
    "Segment Your Network.",
    "Restrict Access to Update Functions.",
    "Backup Firmware Images."
  ],
  vpn: [
    "Strong Password Policies and Multi-Factor Authentication (MFA).",
    "Regular VPN Software Updates.",
    "Use Strong Encryption Standards."
  ],
  firewall: [
    "Regular Firewall Updates: Patch vulnerabilities promptly.",
    "Strict Firewall Rules: Implement a 'deny all, allow by exception' approach, only allowing authorized traffic.",
    "Network segmentation: Divide the network into segments to limit the potential impact of a breach.",
    "Application Control: Use firewalls with application control features to restrict unauthorized applications."
  ],
  waf: [
    "Keep WAF Software Updated: Patch vulnerabilities promptly.",
    "Regular WAF Rule Review and Tuning: Fine-tune WAF rules to balance security and legitimate traffic flow.",
    "Layered Security Approach: A WAF is just one piece of the puzzle. Combine it with other security measures like intrusion detection systems and strong server security practices.",
    "Security Testing: Conduct regular penetration testing to identify and address WAF vulnerabilities."
  ],
  wifi: [
    "Strong WiFi Passwords: Use complex passwords with a combination of uppercase and lowercase letters, numbers, and symbols. Consider using a password manager to generate and store strong passwords.",
    "WPA3 Encryption: Implement WPA3 encryption, the latest and most secure WiFi encryption protocol available for consumer and business use.",
    "Guest Network: Create a separate guest network with limited access for visitors, isolating them from the main company network.",
    "Network Segmentation: Segmenting the network into smaller subnets can limit the potential damage if a device is compromised.",
    "Device Security: Keep all devices on the network updated with the latest security patches to address vulnerabilities."
  ],
  rdp: [
    "Disable RDP if not absolutely necessary.",
    "Limit RDP access to specific IPs.",
    "Implement role-based access control (RBAC).",
    "Use strong passwords and multi-factor authentication (MFA).",
    "Change the default RDP port (3389).",
    "Enable Network Level Authentication (NLA).",
    "Disable unused RDP features.",
    "Keep RDP software updated.",
    "Implement security monitoring tools.",
    "Enable account lockout policies."
  ],
  cloud: [
    "Strong Passwords & Multi-Factor Authentication (MFA).",
    "Implement granular access controls within your cloud storage platform.",
    "Enable encryption to scramble your data."
  ]
};

let selectedElements = [];

function selectElements() {
  selectedElements = [];
  const checkboxes = document.querySelectorAll('input[name="elements"]:checked');
  for (const checkbox of checkboxes) {
    selectedElements.push(checkbox.dataset.element);
  }

  const checklistContainer = document.getElementById('checklist-container');
  checklistContainer.style.display = selectedElements.length > 0 ? 'block' : 'none';

  generateChecklist();
}

function generateChecklist() {
  const checklist = document.getElementById('checklist');
  checklist.innerHTML = '';

  if (selectedElements.length === 0) {
    checklist.innerHTML = '<p>Please select at least one element to view its security checklist.</p>';
    return;
  }

  for (const element of selectedElements) {
    const instructions = elementInstructions[element];
    checklist.innerHTML += `<h3>${element} Security Instructions</h3><ul>`;
    instructions.forEach(instruction => {
      checklist.innerHTML += `<li><input type="checkbox" data-instruction="${instruction}"> ${instruction}</li>`;
    });
    checklist.innerHTML += '</ul>';
  }

  const generateReportBtn = document.getElementById('generate-report-btn');
  generateReportBtn.style.display = 'block'; // Show the "Generate Security Report" button
}

function generateReport() {
  const report = document.getElementById('report');
  report.style.display = 'block';
  report.innerHTML = '';

  let selectedInstructions = [];
  const checklistItems = document.querySelectorAll('#checklist input[type="checkbox"]');

  for (const item of checklistItems) {
    if (item.checked) {
      selectedInstructions.push(item.dataset.instruction);
    }
    updateFinalSecurityScore();
  }

  // Calculate security score level
  let totalInstructions = 0;
  let checkedInstructions = 0;

  for (const element of selectedElements) {
    const instructions = elementInstructions[element];
    totalInstructions += instructions.length;
    instructions.forEach(instruction => {
      if (selectedInstructions.includes(instruction)) {
        checkedInstructions++;
      }
    });
  }

   securityLevel = Math.round((checkedInstructions / totalInstructions) * 100);
  

  report.innerHTML = `<h2>Security Report</h2>
  <p>Your company's current security level is estimated at <b>${securityLevel}%</b>.</p>
  <p>This report details the security instructions for the selected elements and highlights the ones that haven't been implemented yet.</p>`;

  // Display unselected instructions for selected elements
  for (const element of selectedElements) {
    const instructions = elementInstructions[element];
    const unselectedInstructions = instructions.filter(instruction => !selectedInstructions.includes(instruction));
    if (unselectedInstructions.length > 0) {
      report.innerHTML += `<div class="report-section"><h3>Next Steps for ${element}</h3><ul>`;
      unselectedInstructions.forEach(instruction => {
        report.innerHTML += `<li>${instruction}</li>`;
      });
      report.innerHTML += '</ul></div>';
    }
  }
}





function generateTechnicalReport() {
  const sections = ['mitm', 'phishing', 'malicious', 'patches', 'credentials', 'insider', 'removable', 'supplychain', 'api'];
  const reportContainer = document.getElementById('technical-report');
  reportContainer.innerHTML = ''; // Clear previous report

  let totalUnchecked = 0;
  let totalItems = 0;

  sections.forEach(section => {
    const checklistItems = document.querySelectorAll(`#security-checklist input[name="${section}"]:not(:checked)`);
    const sectionTotalItems = document.querySelectorAll(`#security-checklist input[name="${section}"]`).length;

    totalUnchecked += checklistItems.length;
    totalItems += sectionTotalItems;

    if (checklistItems.length > 0) {
      const sectionTitle = document.createElement('h3');
      sectionTitle.textContent = `${section.charAt(0).toUpperCase() + section.slice(1)} Security`;

      const sectionContent = document.createElement('div');
      const securityLevel = ((sectionTotalItems - checklistItems.length) / sectionTotalItems) * 100;
      sectionContent.innerHTML = `<p>Technical Security Level: ${securityLevel.toFixed(2)}%</p>`;

      const nextSteps = document.createElement('div');
      nextSteps.innerHTML = `<h4>Next Steps:</h4><ul>`;
      checklistItems.forEach(item => {
        nextSteps.innerHTML += `<li>${item.value}</li>`;
      });
      nextSteps.innerHTML += `</ul>`;

      sectionContent.appendChild(nextSteps);
      reportContainer.appendChild(sectionTitle);
      reportContainer.appendChild(sectionContent);
    }
  });

  if (totalItems > 0) {
    const technicalScore = ((totalItems - totalUnchecked) / totalItems) * 100;
    const scoreElement = document.createElement('p');
    scoreElement.id = 'technical-score';
    scoreElement.textContent = ` ${technicalScore.toFixed(2)}%`;
    reportContainer.appendChild(scoreElement);
  } else {
    reportContainer.innerHTML = '<p>No security measures selected.</p>';
  }

  reportContainer.style.display = 'block';
updateFinalSecurityScore();
}

function calculateFinalSecurityScore() {

  const securityReportScoreElement = document.getElementById('security-report-score');
  const technicalScoreElement = document.getElementById('technical-score');

  const securityReportScore = parseFloat(securityReportScoreElement ? securityReportScoreElement.textContent.replace('%', '') : 0);
  const technicalScore = parseFloat(technicalScoreElement ? technicalScoreElement.textContent.replace('%', '') : 0);

  if (isNaN(securityReportScore) || isNaN(technicalScore)) {
    return 'N/A';
  }

  const finalScore = (securityLevel + technicalScore) / 2;
  return finalScore.toFixed(2)  ;
}

function updateFinalSecurityScore() {
  const finalScoreElement = document.getElementById('final-score');
  const finalScore = calculateFinalSecurityScore()  ;

  if (finalScoreElement) {
    finalScoreElement.textContent = `Final Security Level Score: ${finalScore }%`;
  }
}

// Call updateFinalSecurityScore function when the page loads to ensure the score is displayed if the reports are already generated
document.addEventListener('DOMContentLoaded', updateFinalSecurityScore);



